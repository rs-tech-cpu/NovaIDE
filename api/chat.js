const SUPPORTED_GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];

function normalizeModel(model) {
  const value = String(model || "").trim();
  return SUPPORTED_GEMINI_MODELS.includes(value) ? value : "gemini-2.5-flash-lite";
}

function extractResponseText(data) {
  if (!Array.isArray(data.candidates)) {
    return "";
  }

  return data.candidates
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("\n")
    .trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: "GEMINI_API_KEY or GOOGLE_API_KEY is not configured in Vercel." });
    return;
  }

  const { model = "gemini-2.5-flash-lite", prompt = "", workspaceContext = "" } = request.body || {};

  if (!String(prompt).trim()) {
    response.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const upstreamResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(normalizeModel(model))}:generateContent`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You are a helpful coding assistant inside a browser IDE. Use the provided workspace context to answer clearly, concretely, and practically.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${workspaceContext}\n\nUser request:\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 700,
        },
      }),
    });

    const data = await upstreamResponse.json();

    if (!upstreamResponse.ok) {
      response.status(upstreamResponse.status).json({
        error: data.error?.message || `Gemini request failed with ${upstreamResponse.status}.`,
      });
      return;
    }

    response.status(200).json({
      output_text: extractResponseText(data),
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Gemini request failed.",
    });
  }
}
