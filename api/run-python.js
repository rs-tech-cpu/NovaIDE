import { requireNovaAccess } from "./_auth.js";
import { consumeRunQuota } from "./_quota.js";
import { enforceRateLimit } from "./_rate-limit.js";

const SUPPORTED_RUN_LANGUAGES = new Set(["python", "cpp", "csharp", "swift", "java"]);
const MAX_RUN_FILES = 8;
const MAX_FILE_BYTES = 200000;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!enforceRateLimit(request, response, { keyPrefix: "run", limit: 15, windowMs: 5 * 60_000 })) {
    return;
  }

  const access = await requireNovaAccess(request, response);

  if (!access) {
    return;
  }

  const apiKey = process.env.ONECOMPILER_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: "ONECOMPILER_API_KEY is not configured in Vercel." });
    return;
  }

  const { language = "python", stdin = "", files = [] } = request.body || {};
  const normalizedLanguage = String(language || "").trim().toLowerCase();

  if (!SUPPORTED_RUN_LANGUAGES.has(normalizedLanguage)) {
    response.status(400).json({ error: "Unsupported runtime." });
    return;
  }

  if (!Array.isArray(files) || files.length === 0) {
    response.status(400).json({ error: "At least one file is required." });
    return;
  }

  const sanitizedFiles = files
    .filter((file) => file && typeof file.name === "string")
    .map((file) => ({
      name: String(file.name || "").replace(/\\/g, "/").replace(/^\/+/, "").slice(0, 180),
      content: typeof file.content === "string" ? file.content.slice(0, MAX_FILE_BYTES) : "",
    }))
    .filter((file) => file.name && file.content.length <= MAX_FILE_BYTES)
    .slice(0, MAX_RUN_FILES);

  if (!sanitizedFiles.length) {
    response.status(400).json({ error: "Valid files are required." });
    return;
  }

  let quota;

  try {
    quota = await consumeRunQuota(access.uid);
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Server-side run quota is unavailable.",
    });
    return;
  }

  if (!quota.allowed) {
    response.status(429).json({
      error: `You have reached the ${quota.limit}-run limit for Nova IDE script execution. The editor and AI assistant are still available.`,
      quota,
    });
    return;
  }

  try {
    const upstreamResponse = await fetch("https://api.onecompiler.com/v1/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        language: normalizedLanguage,
        stdin: String(stdin || "").slice(0, 12000),
        files: sanitizedFiles,
      }),
    });

    const data = await upstreamResponse.json();
    response.status(upstreamResponse.status).json({
      ...data,
      quota,
    });
  } catch (error) {
    response.status(502).json({
      quota,
      error: error instanceof Error ? error.message : "OneCompiler request failed.",
    });
  }
}
