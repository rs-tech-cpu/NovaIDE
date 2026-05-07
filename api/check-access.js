import { requireVerifiedFirebaseUser } from "./_auth.js";
import { enforceRateLimit } from "./_rate-limit.js";
import { fetchWaitlistDecisionByEmail } from "./_waitlist.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!enforceRateLimit(request, response, { keyPrefix: "check-access", limit: 25, windowMs: 60_000 })) {
    return;
  }

  const decodedToken = await requireVerifiedFirebaseUser(request, response);

  if (!decodedToken) {
    return;
  }

  const email = String(decodedToken.email || "").trim().toLowerCase();

  if (!email) {
    response.status(400).json({ error: "Authenticated account is missing an email address." });
    return;
  }

  try {
    const decision = await fetchWaitlistDecisionByEmail(email);
    response.status(200).json(decision);
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Waitlist check failed.",
    });
  }
}
