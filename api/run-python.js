export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ONECOMPILER_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: "ONECOMPILER_API_KEY is not configured in Vercel." });
    return;
  }

  const { language = "python", stdin = "", files = [] } = request.body || {};

  if (!Array.isArray(files) || files.length === 0) {
    response.status(400).json({ error: "At least one file is required." });
    return;
  }

  const sanitizedFiles = files
    .filter((file) => file && typeof file.name === "string")
    .map((file) => ({
      name: file.name,
      content: typeof file.content === "string" ? file.content : "",
    }));

  if (!sanitizedFiles.length) {
    response.status(400).json({ error: "Valid files are required." });
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
        language,
        stdin,
        files: sanitizedFiles,
      }),
    });

    const data = await upstreamResponse.json();
    response.status(upstreamResponse.status).json(data);
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "OneCompiler request failed.",
    });
  }
}
