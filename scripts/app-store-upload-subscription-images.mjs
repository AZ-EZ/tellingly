import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";

const keyId = requiredEnv("ASC_KEY_ID");
const issuerId = requiredEnv("ASC_ISSUER_ID");
const keyPath = requiredEnv("ASC_KEY_PATH");
const privateKey = fs.readFileSync(keyPath, "utf8");

const subscriptions = [
  {
    id: "6783584502",
    productId: "app.tellingly.plus.monthly",
    image: "app-store/subscription-images/tellingly-plus-monthly.jpg",
  },
  {
    id: "6783584539",
    productId: "app.tellingly.plus.annual",
    image: "app-store/subscription-images/tellingly-plus-annual.jpg",
  },
];

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
      const parts = raw.split(/\r?\n\r?\n/);
      const headers = parts.at(-2) || parts[0];
      const text = parts.at(-1) || "";
      const status = Number((headers.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/) || [])[1]);
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = { raw: text.slice(0, 1000) };
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
    if (!response.ok) throw new Error(`upload -> ${response.status}: ${(await response.text()).slice(0, 500)}`);
  } finally {
    clearTimeout(timeout);
  }
}

for (const subscription of subscriptions) {
  const bytes = fs.readFileSync(subscription.image);
  const fileName = subscription.image.split("/").pop();
  const checksum = crypto.createHash("md5").update(bytes).digest("hex");

  const existing = await api("GET", `/v1/subscriptions/${subscription.id}/images`);
  for (const image of existing.data || []) {
    await api("DELETE", `/v1/subscriptionImages/${image.id}`);
  }

  const created = await api("POST", "/v1/subscriptionImages", {
    data: {
      type: "subscriptionImages",
      attributes: {
        fileName,
        fileSize: bytes.length,
      },
      relationships: {
        subscription: {
          data: { type: "subscriptions", id: subscription.id },
        },
      },
    },
  });

  for (const operation of created.data.attributes.uploadOperations || []) {
    await uploadOperation(operation, bytes);
  }

  const updated = await api("PATCH", `/v1/subscriptionImages/${created.data.id}`, {
    data: {
      type: "subscriptionImages",
      id: created.data.id,
      attributes: {
        uploaded: true,
        sourceFileChecksum: checksum,
      },
    },
  });

  console.log(
    JSON.stringify({
      productId: subscription.productId,
      subscriptionId: subscription.id,
      imageId: updated.data.id,
      state: updated.data.attributes.assetDeliveryState?.state,
    }),
  );
}
