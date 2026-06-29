import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";

const appId = "6783204675";
const keyId = requiredEnv("ASC_KEY_ID");
const issuerId = requiredEnv("ASC_ISSUER_ID");
const keyPath = requiredEnv("ASC_KEY_PATH");
const privateKey = fs.readFileSync(keyPath, "utf8");
const metadata = JSON.parse(fs.readFileSync("app-store/app-store-connect-metadata.json", "utf8"));
const contactPhone = process.env.ASC_CONTACT_PHONE;
const requiredBuildVersion = process.env.ASC_BUILD_VERSION || "2";

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
  const header = { alg: "ES256", kid: keyId, typ: "JWT" };
  const payload = { iss: issuerId, iat: now, exp: now + 900, aud: "appstoreconnect-v1" };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(method, path, body, { retries = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const args = [
        "-g",
        "-s",
        "-i",
        "--max-time",
        "30",
        "-X",
        method,
        "-H",
        `Authorization: Bearer ${bearerToken()}`,
        "-H",
        "Content-Type: application/json",
      ];
      if (body) args.push("-d", JSON.stringify(body));
      args.push(`https://api.appstoreconnect.apple.com${path}`);

      const raw = execFileSync("curl", args, { encoding: "utf8", timeout: 35000 });
      const [headerText, ...bodyParts] = raw.split(/\r?\n\r?\n/);
      const status = Number((headerText.match(/HTTP\/\d(?:\.\d)?\s+(\d+)/) || [])[1]);
      const text = bodyParts.join("\n\n");
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = { raw: text.slice(0, 500) };
      }

      if (status >= 200 && status < 300) {
        console.log(`${method} ${path} -> ${status}`);
        return json;
      }

      const detail = json?.errors?.[0]?.detail || json?.errors?.[0]?.title || JSON.stringify(json).slice(0, 300);
      lastError = new Error(`${method} ${path} -> ${status}: ${detail}`);
      console.log(`${lastError.message} (attempt ${attempt}/${retries})`);

      if (![408, 409, 429, 500, 502, 503, 504].includes(status)) break;
    } catch (error) {
      lastError = error;
      console.log(`${method} ${path} -> ${error.code || error.name || "ERROR"} (attempt ${attempt}/${retries})`);
    }
    await sleep(2000 * attempt);
  }
  throw lastError;
}

async function main() {
  const versions = await request("GET", `/v1/apps/${appId}/appStoreVersions?filter[platform]=IOS&limit=10`);
  const version = versions.data.find((item) => item.attributes.versionString === "1.0") || versions.data[0];
  const versionId = version.id;

  const localizations = await request(
    "GET",
    `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations?limit=10`,
  );
  const localization = localizations.data.find((item) => item.attributes.locale === "en-US") || localizations.data[0];

  const builds = await request("GET", `/v1/builds?filter[app]=${appId}&sort=-uploadedDate&limit=10`);
  const build = builds.data.find(
    (item) =>
      item.attributes.version === requiredBuildVersion &&
      item.attributes.processingState === "VALID" &&
      !item.attributes.expired,
  );

  if (!build) {
    const found = builds.data.map((item) => `${item.attributes.version}:${item.attributes.processingState}`).join(", ");
    throw new Error(`Build ${requiredBuildVersion} is not ready in App Store Connect. Found builds: ${found || "none"}.`);
  }

  await request("PATCH", `/v1/appStoreVersionLocalizations/${localization.id}`, {
    data: {
      type: "appStoreVersionLocalizations",
      id: localization.id,
      attributes: {
        description: metadata.description,
        keywords: metadata.keywords,
        marketingUrl: "https://tellingly.zandrews77.workers.dev",
        promotionalText: metadata.promotionalText,
        supportUrl: metadata.supportUrl,
      },
    },
  });

  await request("PATCH", `/v1/appStoreVersions/${versionId}`, {
    data: {
      type: "appStoreVersions",
      id: versionId,
      attributes: {
        copyright: "2026 Andris Zimelis",
        releaseType: "AFTER_APPROVAL",
        usesIdfa: false,
      },
    },
  });

  await request("PATCH", `/v1/appStoreVersions/${versionId}/relationships/build`, {
    data: { type: "builds", id: build.id },
  });

  const refreshed = await request("GET", `/v1/appStoreVersions/${versionId}/build`);

  let reviewDetailId = null;
  if (contactPhone) {
    const existingReviewDetail = await request(
      "GET",
      `/v1/appStoreVersions/${versionId}/appStoreReviewDetail`,
      null,
      { retries: 2 },
    );

    const reviewAttributes = {
      contactFirstName: "Andris",
      contactLastName: "Zimelis",
      contactEmail: "support@tellingly.app",
      contactPhone,
      notes: metadata.reviewNotes,
    };

    if (existingReviewDetail.data?.id) {
      const reviewDetail = await request("PATCH", `/v1/appStoreReviewDetails/${existingReviewDetail.data.id}`, {
        data: {
          type: "appStoreReviewDetails",
          id: existingReviewDetail.data.id,
          attributes: reviewAttributes,
        },
      });
      reviewDetailId = reviewDetail.data.id;
    } else {
      const reviewDetail = await request("POST", "/v1/appStoreReviewDetails", {
        data: {
          type: "appStoreReviewDetails",
          attributes: reviewAttributes,
          relationships: {
            appStoreVersion: {
              data: { type: "appStoreVersions", id: versionId },
            },
          },
        },
      });
      reviewDetailId = reviewDetail.data.id;
    }
  } else {
    console.log("Skipped review detail: set ASC_CONTACT_PHONE='+1 ...' to create the required review contact record.");
  }

  console.log(
    JSON.stringify(
      {
        appId,
        versionId,
        localizationId: localization.id,
        selectedBuildId: refreshed.data?.id || build.id,
        reviewDetailId,
        requiredBuildVersion,
        versionState: version.attributes.appStoreState,
        completed: [
          "metadata",
          "copyright/release/idfa",
          "build selection",
          ...(reviewDetailId ? ["review detail"] : []),
        ],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
