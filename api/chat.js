function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  return data.output
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .filter((item) => item && item.type === "output_text")
    .map((item) => item.text || "")
    .join("\n")
    .trim();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: "OPENAI_API_KEY is not configured in Vercel." });
    return;
  }

  const { model = "gpt-5", prompt = "", workspaceContext = "" } = request.body || {};

  if (!String(prompt).trim()) {
    response.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const upstreamResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: "You are a helpful coding assistant inside a browser IDE. Use the provided workspace context to answer clearly, concretely, and practically.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `${workspaceContext}\n\nUser request:\n${prompt}`,
              },
            ],
          },
        ],
        max_output_tokens: 700,
      }),
    });

    const data = await upstreamResponse.json();

    if (!upstreamResponse.ok) {
      response.status(upstreamResponse.status).json({
        error: data.error?.message || `OpenAI request failed with ${upstreamResponse.status}.`,
      });
      return;
    }

    response.status(200).json({
      output_text: extractResponseText(data),
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "OpenAI request failed.",
    });
  }
}
