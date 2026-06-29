import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const keyId = requiredEnv("ASC_KEY_ID");
const issuerId = requiredEnv("ASC_ISSUER_ID");
const keyPath = requiredEnv("ASC_KEY_PATH");
const privateKey = fs.readFileSync(keyPath, "utf8");
const screenshotSetId = process.env.ASC_SCREENSHOT_SET_ID || "114b7841-43e0-431f-a26b-0195db03bab9";
const screenshotDir = "app-store/screenshots-6-9";

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Set ${name} before running this script.`);
  return value;
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function bearerToken() {
  const now = Math.floor(Date.now() / 1000);
  const signingInput = `${base64url(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }))}.${base64url(
    JSON.stringify({ iss: issuerId, iat: now, exp: now + 900, aud: "appstoreconnect-v1" }),
  )}`;
  const signature = crypto.sign("sha256", Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding: "ieee-p1363",
  });
  return `${signingInput}.${signature
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")}`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function api(method, apiPath, body = null, retries = 4) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const args = [
      "-g",
      "-s",
      "-i",
      "--max-time",
      "45",
      "-X",
      method,
      "-H",
      `Authorization: Bearer ${bearerToken()}`,
      "-H",
      "Content-Type: application/json",
    ];
    if (body) args.push("-d", JSON.stringify(body));
    args.push(`https://api.appstoreconnect.apple.com${apiPath}`);
    try {
      const raw = execFileSync("curl", args, { encoding: "utf8", timeout: 50000 });
      const [headers, ...bodyParts] = raw.split(/\r?\n\r?\n/);
      const status = Number((headers.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/) || [])[1]);
      let json = null;
      try {
        json = JSON.parse(bodyParts.join("\n\n"));
      } catch {
        json = { raw: bodyParts.join("\n\n").slice(0, 500) };
      }
      if (status >= 200 && status < 300) {
        console.log(`${method} ${apiPath} -> ${status}`);
        return json;
      }
      lastError = new Error(`${method} ${apiPath} -> ${status}: ${JSON.stringify(json).slice(0, 1000)}`);
      console.log(`${lastError.message} (attempt ${attempt}/${retries})`);
      if (![408, 409, 429, 500, 502, 503, 504].includes(status)) break;
    } catch (error) {
      lastError = error;
      console.log(`${method} ${apiPath} -> ${error.code || error.name || "ERROR"} (attempt ${attempt}/${retries})`);
    }
    await sleep(2000 * attempt);
  }
  throw lastError;
}

async function uploadOperation(operation, bytes) {
  const headers = {};
  for (const header of operation.requestHeaders || []) {
    headers[header.name] = header.value;
  }
  const chunk = bytes.subarray(operation.offset || 0, (operation.offset || 0) + (operation.length || bytes.length));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(operation.url, {
      method: operation.method || "PUT",
      headers,
      body: chunk,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`upload -> ${response.status}: ${(await response.text()).slice(0, 500)}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

const files = fs
  .readdirSync(screenshotDir)
  .filter((file) => file.endsWith(".png"))
  .sort()
  .map((file) => path.join(screenshotDir, file));

const existing = await api("GET", `/v1/appScreenshotSets/${screenshotSetId}/appScreenshots?limit=20`);
const existingFileNames = new Set((existing.data || []).map((item) => item.attributes.fileName));

for (const file of files) {
  const bytes = fs.readFileSync(file);
  const fileName = path.basename(file);
  const checksum = crypto.createHash("md5").update(bytes).digest("hex");

  if (existingFileNames.has(fileName)) {
    console.log(`Skipping existing screenshot ${fileName}`);
    continue;
  }

  const created = await api("POST", "/v1/appScreenshots", {
    data: {
      type: "appScreenshots",
      attributes: {
        fileName,
        fileSize: bytes.length,
      },
      relationships: {
        appScreenshotSet: {
          data: { type: "appScreenshotSets", id: screenshotSetId },
        },
      },
    },
  });

  for (const operation of created.data.attributes.uploadOperations || []) {
    await uploadOperation(operation, bytes);
  }

  const updated = await api("PATCH", `/v1/appScreenshots/${created.data.id}`, {
    data: {
      type: "appScreenshots",
      id: created.data.id,
      attributes: {
        uploaded: true,
        sourceFileChecksum: checksum,
      },
    },
  });

  console.log(
    JSON.stringify({
      fileName,
      screenshotId: updated.data.id,
      state: updated.data.attributes.assetDeliveryState?.state,
    }),
  );
}
