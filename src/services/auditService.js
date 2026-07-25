const AppError = require("../utils/AppError");
const validateUrl = require("../utils/validateUrl");
const { fetchPage } = require("./fetcher");
const { parseHtml } = require("./parser");

/**
 * Runs a full Page Pulse audit for a URL string.
 * Returns the JSON-serializable report described in the brief:
 * status, response time, title, meta description, H1 count,
 * images missing alt text, and approximate word count.
 */
async function runAudit(rawUrl) {
  const url = validateUrl(rawUrl);
  const page = await fetchPage(url);

  const isHtml = page.contentType.toLowerCase().includes("html");
  if (!isHtml) {
    throw new AppError(
      415,
      "NOT_HTML",
      `That URL returned "${page.contentType || "an unknown content type"}", not an HTML page.`
    );
  }

  const parsed = parseHtml(page.body);

  return {
    url: url.toString(),
    finalUrl: page.finalUrl && page.finalUrl !== url.toString() ? page.finalUrl : undefined,
    httpStatus: page.status,
    ok: page.ok,
    responseTimeMs: page.elapsedMs,
    title: parsed.title,
    metaDescription: parsed.metaDescription,
    h1Count: parsed.h1Count,
    images: parsed.images,
    wordCount: parsed.wordCount,
    checkedAt: new Date().toISOString(),
  };
}

module.exports = { runAudit };
