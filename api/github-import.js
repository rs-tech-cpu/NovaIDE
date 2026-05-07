import { requireNovaAccess } from "./_auth.js";
import { enforceRateLimit } from "./_rate-limit.js";

const MAX_IMPORT_FILES = 160;
const MAX_FILE_BYTES = 350000;

function parseRepositoryInput(input) {
  const normalized = String(input || "")
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\/+$/, "")
    .replace(/\.git$/i, "");

  const [owner, repo] = normalized.split("/");

  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}

async function requestGitHubJson(url) {
  const upstreamResponse = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "NovaIDE",
    },
  });

  const data = await upstreamResponse.json().catch(() => ({}));
  return { upstreamResponse, data };
}

function decodeBlobContent(content, encoding) {
  if (encoding !== "base64" || typeof content !== "string") {
    return null;
  }

  const decoded = Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
  return decoded.includes("\u0000") ? null : decoded;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!enforceRateLimit(request, response, { keyPrefix: "github-import", limit: 8, windowMs: 10 * 60_000 })) {
    return;
  }

  const access = await requireNovaAccess(request, response);

  if (!access) {
    return;
  }

  const { repository = "", ref = "" } = request.body || {};
  const parsedRepository = parseRepositoryInput(repository);

  if (!parsedRepository) {
    response.status(400).json({ error: "Enter a GitHub repository like owner/repo or a full GitHub URL." });
    return;
  }

  const { owner, repo } = parsedRepository;

  try {
    const repoMetaResult = await requestGitHubJson(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);

    if (!repoMetaResult.upstreamResponse.ok) {
      response.status(repoMetaResult.upstreamResponse.status).json({
        error: repoMetaResult.data?.message || `Could not load ${owner}/${repo}.`,
      });
      return;
    }

    const resolvedRef = String(ref || "").trim().slice(0, 120) || repoMetaResult.data.default_branch || "main";
    const treeResult = await requestGitHubJson(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(resolvedRef)}?recursive=1`
    );

    if (!treeResult.upstreamResponse.ok) {
      response.status(treeResult.upstreamResponse.status).json({
        error: treeResult.data?.message || `Could not read files from ${owner}/${repo}@${resolvedRef}.`,
      });
      return;
    }

    const treeEntries = Array.isArray(treeResult.data.tree) ? treeResult.data.tree : [];
    const blobEntries = treeEntries.filter((entry) => entry?.type === "blob" && typeof entry.path === "string");
    const oversizedCount = blobEntries.filter((entry) => Number(entry.size || 0) > MAX_FILE_BYTES).length;
    const importEntries = blobEntries
      .filter((entry) => Number(entry.size || 0) <= MAX_FILE_BYTES)
      .slice(0, MAX_IMPORT_FILES);

    const files = [];
    let failedCount = 0;
    let binaryCount = 0;

    for (const entry of importEntries) {
      const blobResult = await requestGitHubJson(entry.url);

      if (!blobResult.upstreamResponse.ok) {
        failedCount += 1;
        continue;
      }

      const decodedContent = decodeBlobContent(blobResult.data.content, blobResult.data.encoding);

      if (decodedContent === null) {
        binaryCount += 1;
        continue;
      }

      files.push({
        path: entry.path,
        content: decodedContent,
      });
    }

    response.status(200).json({
      repository: `${owner}/${repo}`,
      repoName: repo,
      ref: resolvedRef,
      files,
      stats: {
        imported: files.length,
        skippedOversized: oversizedCount,
        skippedBinary: binaryCount,
        skippedFailed: failedCount,
        truncated: Math.max(0, blobEntries.length - oversizedCount - importEntries.length),
        sourceTreeTruncated: Boolean(treeResult.data.truncated),
      },
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "GitHub import failed.",
    });
  }
}
