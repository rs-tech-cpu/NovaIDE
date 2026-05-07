import { requireNovaAccess } from "./_auth.js";
import { getRunQuotaStatus } from "./_quota.js";
import { enforceRateLimit } from "./_rate-limit.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!enforceRateLimit(request, response, { keyPrefix: "quota-status", limit: 30, windowMs: 60_000 })) {
    return;
  }

  const access = await requireNovaAccess(request, response);

  if (!access) {
    return;
  }

  try {
    const quota = await getRunQuotaStatus(access.uid);
    response.status(200).json({ quota });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : "Could not load run quota.",
    });
  }
}
