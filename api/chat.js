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

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((entry) => ({
      role: entry?.role === "assistant" ? "model" : "user",
      text: String(entry?.content || "").trim(),
    }))
    .filter((entry) => entry.text)
    .slice(-10);
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

  const { model = "gemini-2.5-flash-lite", prompt = "", workspaceContext = "", history = [] } = request.body || {};

  if (!String(prompt).trim()) {
    response.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const contents = [
      ...normalizeHistory(history).map((entry) => ({
        role: entry.role,
        parts: [
          {
            text: entry.text,
          },
        ],
      })),
      {
        role: "user",
        parts: [
          {
            text: `${workspaceContext}\n\nUser request:\n${prompt}`,
          },
        ],
      },
    ];

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
              text: "You are a helpful coding assistant inside a browser IDE. Use the provided workspace context and recent conversation history to answer clearly, concretely, and practically. Keep follow-up answers grounded in the earlier turns of the same chat. If the latest user message is ambiguous, interpret it in the context of the immediately preceding conversation before answering. Do not default to describing yourself when the user is clearly following up on a prior topic, riddle, example, or code discussion. For example, if the user asks a riddle and then says they do not know or asks 'who are you?', treat that as a request for the riddle answer, not your own identity. Whenever you provide code, wrap it in triple backticks and include the language tag when possible. If the user asks for a simple code snippet such as a hello world example, prefer returning only the fenced code block unless extra explanation is explicitly needed. This IDE runs supported code through OneCompiler, so do not suggest pip install, package manager installation steps, or dependency setup commands as if they can be executed here. If a user asks for a library that may not be available, say that OneCompiler may only support standard libraries or preinstalled packages and suggest a fallback when possible.",
            },
          ],
        },
        contents,
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
