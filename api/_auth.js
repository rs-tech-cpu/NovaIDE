import { createVerify, X509Certificate } from "node:crypto";
import { fetchWaitlistDecisionByEmail } from "./_waitlist.js";

const FIREBASE_PROJECT_ID = String(process.env.FIREBASE_PROJECT_ID || "pixelchat-82d61").trim();
const FIREBASE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

let cachedCerts = null;
let certsExpireAt = 0;

function base64UrlToBuffer(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64");
}

function parseJwtPart(value) {
  return JSON.parse(base64UrlToBuffer(value).toString("utf-8"));
}

function getBearerToken(request) {
  const header = request.headers?.authorization || request.headers?.Authorization || "";

  if (!header.startsWith("Bearer ")) {
    return "";
  }

  return header.slice(7).trim();
}

async function loadFirebaseCerts() {
  if (cachedCerts && Date.now() < certsExpireAt) {
    return cachedCerts;
  }

  const response = await fetch(FIREBASE_CERTS_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load Firebase public certificates (${response.status}).`);
  }

  const cacheControl = response.headers.get("cache-control") || "";
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;

  cachedCerts = await response.json();
  certsExpireAt = Date.now() + maxAgeMs;
  return cachedCerts;
}

function verifySignature({ signingInput, signature, pemCertificate }) {
  const certificate = new X509Certificate(pemCertificate);
  const verifier = createVerify("RSA-SHA256");
  verifier.update(signingInput);
  verifier.end();
  return verifier.verify(certificate.publicKey, base64UrlToBuffer(signature));
}

export async function verifyFirebaseIdToken(idToken) {
  const token = String(idToken || "").trim();

  if (!token) {
    throw new Error("Missing Firebase ID token.");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid Firebase ID token format.");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtPart(encodedHeader);
  const payload = parseJwtPart(encodedPayload);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Invalid Firebase ID token header.");
  }

  const now = Math.floor(Date.now() / 1000);
  const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

  if (payload.aud !== FIREBASE_PROJECT_ID || payload.iss !== expectedIssuer) {
    throw new Error(
      `Firebase ID token project mismatch. Expected aud "${FIREBASE_PROJECT_ID}" and iss "${expectedIssuer}", received aud "${String(payload.aud || "")}" and iss "${String(payload.iss || "")}".`
    );
  }

  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Firebase ID token subject is invalid.");
  }

  if (typeof payload.iat !== "number" || typeof payload.exp !== "number" || payload.iat > now || payload.exp <= now) {
    throw new Error("Firebase ID token is expired or not yet valid.");
  }

  if (typeof payload.auth_time !== "number" || payload.auth_time > now) {
    throw new Error("Firebase ID token auth time is invalid.");
  }

  const certificates = await loadFirebaseCerts();
  const pemCertificate = certificates?.[header.kid];

  if (!pemCertificate) {
    throw new Error("Firebase ID token key is unknown.");
  }

  const isValid = verifySignature({
    signingInput: `${encodedHeader}.${encodedPayload}`,
    signature: encodedSignature,
    pemCertificate,
  });

  if (!isValid) {
    throw new Error("Firebase ID token signature verification failed.");
  }

  return payload;
}

export async function requireVerifiedFirebaseUser(request, response) {
  try {
    const idToken = getBearerToken(request);
    const decodedToken = await verifyFirebaseIdToken(idToken);
    return decodedToken;
  } catch (error) {
    response.status(401).json({
      error: error instanceof Error ? error.message : "Unauthorized.",
    });
    return null;
  }
}

export async function requireNovaAccess(request, response) {
  const decodedToken = await requireVerifiedFirebaseUser(request, response);

  if (!decodedToken) {
    return null;
  }

  const email = String(decodedToken.email || "").trim().toLowerCase();

  if (!email) {
    response.status(403).json({ error: "Authenticated account does not include an email address." });
    return null;
  }

  try {
    const waitlistDecision = await fetchWaitlistDecisionByEmail(email);

    if (!waitlistDecision.approved) {
      response.status(403).json({
        error: waitlistDecision.reason || "Nova early access is not enabled for this account.",
      });
      return null;
    }

    return {
      uid: String(decodedToken.sub),
      email,
      token: decodedToken,
    };
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Access check failed.",
    });
    return null;
  }
}
