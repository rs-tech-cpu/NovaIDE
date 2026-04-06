function normalizeHeader(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((cell) => String(cell).trim() !== ""));
}

function findHeaderIndex(headers, explicitHeader, fallbacks) {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));

  if (explicitHeader) {
    const explicitNormalized = normalizeHeader(explicitHeader);
    const explicitIndex = normalizedHeaders.findIndex((header) => header === explicitNormalized);
    if (explicitIndex >= 0) {
      return explicitIndex;
    }
  }

  for (const fallback of fallbacks) {
    const fallbackNormalized = normalizeHeader(fallback);
    const directIndex = normalizedHeaders.findIndex((header) => header === fallbackNormalized);
    if (directIndex >= 0) {
      return directIndex;
    }
  }

  return normalizedHeaders.findIndex((header) => {
    return fallbacks.some((fallback) => header.includes(normalizeHeader(fallback)));
  });
}

function isApprovedValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["yes", "y", "true", "1", "approved", "allow", "allowed", "granted"].includes(normalized);
}

function rowContainsEmail(row, email) {
  return row.some((cell) => String(cell || "").trim().toLowerCase() === email);
}

function rowContainsApproval(row, email) {
  return row.some((cell) => {
    const normalized = String(cell || "").trim().toLowerCase();
    if (!normalized || normalized === email) {
      return false;
    }

    return isApprovedValue(normalized);
  });
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    response.setHeader("Allow", "GET, POST");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const csvUrl = process.env.NOVA_WAITLIST_CSV_URL;

  if (!csvUrl) {
    response.status(500).json({ error: "NOVA_WAITLIST_CSV_URL is not configured in Vercel." });
    return;
  }

  const email = String(
    request.method === "GET"
      ? request.query?.email || ""
      : request.body?.email || ""
  ).trim().toLowerCase();

  if (!email) {
    response.status(400).json({ error: "Email is required." });
    return;
  }

  try {
    const upstreamResponse = await fetch(csvUrl, {
      headers: {
        Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      response.status(502).json({ error: `Could not load waitlist sheet (${upstreamResponse.status}).` });
      return;
    }

    const csvText = await upstreamResponse.text();
    const rows = parseCsv(csvText);

    if (!rows.length) {
      response.status(200).json({ approved: false, reason: "Waitlist sheet is empty." });
      return;
    }

    const [headers, ...dataRows] = rows;
    const emailIndex = findHeaderIndex(
      headers,
      process.env.NOVA_WAITLIST_EMAIL_HEADER,
      ["email", "pixel wave email", "login email", "email used to login to pixel wave"]
    );
    const approvedIndex = findHeaderIndex(
      headers,
      process.env.NOVA_WAITLIST_APPROVED_HEADER,
      ["approved", "early access", "access approved", "allow access", "status"]
    );

    const matchingRows = dataRows.filter((row) => {
      if (emailIndex >= 0 && String(row[emailIndex] || "").trim().toLowerCase() === email) {
        return true;
      }

      return rowContainsEmail(row, email);
    });

    if (!matchingRows.length) {
      response.status(200).json({
        approved: false,
        reason: emailIndex < 0
          ? "No email column was detected, and the email was not found anywhere in the waitlist row data."
          : "Email not found on the waitlist.",
      });
      return;
    }

    const approved = matchingRows.some((row) => {
      return approvedIndex >= 0
        ? isApprovedValue(row[approvedIndex])
        : rowContainsApproval(row, email);
    });
    response.status(200).json({
      approved,
      reason: approved
        ? "Approved for Nova early access."
        : approvedIndex >= 0
          ? `Email found in ${matchingRows.length} waitlist entr${matchingRows.length === 1 ? "y" : "ies"}, but early access is not approved yet.`
          : "Email found on the waitlist, but no approved value was detected in that row.",
    });
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Waitlist check failed.",
    });
  }
}

