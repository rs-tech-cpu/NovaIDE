const buckets = new Map();

function getClientKey(request) {
  const forwardedFor = request.headers?.["x-forwarded-for"] || request.headers?.["X-Forwarded-For"] || "";
  const firstForwarded = String(forwardedFor).split(",")[0].trim();
  const fallback = request.socket?.remoteAddress || "unknown";
  return firstForwarded || fallback;
}

export function enforceRateLimit(request, response, { keyPrefix = "default", limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const key = `${keyPrefix}:${getClientKey(request)}`;
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (current.count >= limit) {
    response.status(429).json({
      error: "Too many requests. Please slow down and try again shortly.",
    });
    return false;
  }

  current.count += 1;
  return true;
}
