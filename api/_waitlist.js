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

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        current += "\"";
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

export async function fetchWaitlistDecisionByEmail(email) {
  const csvUrl = process.env.NOVA_WAITLIST_CSV_URL;

  if (!csvUrl) {
    throw new Error("NOVA_WAITLIST_CSV_URL is not configured in Vercel.");
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      approved: false,
      reason: "Email is required.",
    };
  }

  const upstreamResponse = await fetch(csvUrl, {
    headers: {
      Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!upstreamResponse.ok) {
    throw new Error(`Could not load waitlist sheet (${upstreamResponse.status}).`);
  }

  const csvText = await upstreamResponse.text();
  const rows = parseCsv(csvText);

  if (!rows.length) {
    return {
      approved: false,
      reason: "Waitlist sheet is empty.",
    };
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
    if (emailIndex >= 0 && String(row[emailIndex] || "").trim().toLowerCase() === normalizedEmail) {
      return true;
    }

    return rowContainsEmail(row, normalizedEmail);
  });

  if (!matchingRows.length) {
    return {
      approved: false,
      reason: emailIndex < 0
        ? "No email column was detected, and the email was not found anywhere in the waitlist row data."
        : "Email not found on the waitlist.",
    };
  }

  const approved = matchingRows.some((row) => {
    return approvedIndex >= 0
      ? isApprovedValue(row[approvedIndex])
      : rowContainsApproval(row, normalizedEmail);
  });

  return {
    approved,
    reason: approved
      ? "Approved for Nova early access."
      : approvedIndex >= 0
        ? `Email found in ${matchingRows.length} waitlist entr${matchingRows.length === 1 ? "y" : "ies"}, but early access is not approved yet.`
        : "Email found on the waitlist, but no approved value was detected in that row.",
  };
}
