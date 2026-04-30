export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    response.status(500).json({ error: "SLACK_WEBHOOK_URL is not configured in Vercel." });
    return;
  }

  const {
    title = "",
    message = "",
    workspaceName = "Nova workspace",
    activeFile = "No active file",
    language = "Text",
    totalFiles = 0,
    pendingChanges = 0,
  } = request.body || {};

  const normalizedTitle = String(title || "").trim();
  const normalizedMessage = String(message || "").trim();

  if (!normalizedTitle || !normalizedMessage) {
    response.status(400).json({ error: "Both a title and message are required." });
    return;
  }

  const payload = {
    text: `${workspaceName}: ${normalizedTitle}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: normalizedTitle.slice(0, 150),
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: normalizedMessage.slice(0, 2900),
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Workspace*\n${String(workspaceName || "Nova workspace").slice(0, 200)}`,
          },
          {
            type: "mrkdwn",
            text: `*Active file*\n${String(activeFile || "No active file").slice(0, 200)}`,
          },
          {
            type: "mrkdwn",
            text: `*Language*\n${String(language || "Text").slice(0, 80)}`,
          },
          {
            type: "mrkdwn",
            text: `*Files / changes*\n${Number(totalFiles || 0)} files, ${Number(pendingChanges || 0)} pending`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Sent from Nova IDE",
          },
        ],
      },
    ],
  };

  try {
    const upstreamResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      response.status(upstreamResponse.status).json({
        error: rawText || `Slack request failed with ${upstreamResponse.status}.`,
      });
      return;
    }

    response.status(200).json({
      ok: true,
      result: rawText || "ok",
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Slack request failed.",
    });
  }
}
