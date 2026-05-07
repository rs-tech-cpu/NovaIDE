import { createSign } from "node:crypto";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "pixelchat-82d61";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const DEFAULT_RUN_LIMIT = 5;

let cachedAccessToken = "";
let accessTokenExpiresAt = 0;

function getServiceAccountConfig() {
  const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  const privateKey = (process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY || process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Server-side Firebase usage guards are not configured. Add FIREBASE_SERVICE_ACCOUNT_EMAIL and FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel.");
  }

  return { clientEmail, privateKey };
}

function base64UrlEncode(value) {
  const input = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function getGoogleAccessToken() {
  if (cachedAccessToken && Date.now() < accessTokenExpiresAt - 60_000) {
    return cachedAccessToken;
  }

  const { clientEmail, privateKey } = getServiceAccountConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: clientEmail,
    scope: FIRESTORE_SCOPE,
    aud: OAUTH_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(privateKey);
  const assertion = `${signingInput}.${base64UrlEncode(signature)}`;

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Could not obtain Google access token.");
  }

  cachedAccessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;
  return cachedAccessToken;
}

function getQuotaDocumentName(uid) {
  return `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/novaideUsers/${encodeURIComponent(uid)}/usage/serverQuota`;
}

function parseIntegerValue(field) {
  if (!field) {
    return 0;
  }

  if (typeof field.integerValue === "string") {
    return Number(field.integerValue) || 0;
  }

  if (typeof field.integerValue === "number") {
    return field.integerValue;
  }

  return 0;
}

async function firestoreRequest(url, init = {}) {
  const accessToken = await getGoogleAccessToken();
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function getRunQuotaStatus(uid, limit = DEFAULT_RUN_LIMIT) {
  const documentName = getQuotaDocumentName(uid);
  const response = await firestoreRequest(`https://firestore.googleapis.com/v1/${documentName}`);

  if (response.status === 404) {
    return {
      limit,
      used: 0,
      remaining: limit,
    };
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Could not read usage quota.");
  }

  const used = Math.max(0, parseIntegerValue(data.fields?.runCount));

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
  };
}

async function writeRunQuotaStatus(uid, used, limit = DEFAULT_RUN_LIMIT) {
  const documentName = getQuotaDocumentName(uid);
  const url = new URL(`https://firestore.googleapis.com/v1/${documentName}`);
  url.searchParams.append("updateMask.fieldPaths", "runCount");
  url.searchParams.append("updateMask.fieldPaths", "updatedAt");

  const response = await firestoreRequest(url.toString(), {
    method: "PATCH",
    body: JSON.stringify({
      name: documentName,
      fields: {
        runCount: {
          integerValue: String(used),
        },
        updatedAt: {
          timestampValue: new Date().toISOString(),
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || "Could not update usage quota.");
  }

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
  };
}

export async function consumeRunQuota(uid, limit = DEFAULT_RUN_LIMIT) {
  const current = await getRunQuotaStatus(uid, limit);

  if (current.used >= limit) {
    return {
      ...current,
      allowed: false,
    };
  }

  const nextUsed = current.used + 1;
  const updated = await writeRunQuotaStatus(uid, nextUsed, limit);

  return {
    ...updated,
    allowed: true,
  };
}
