const AppError = require("./AppError");

/**
 * Validates that a string is a well-formed, fetchable http(s) URL.
 * Throws AppError(400) with a specific reason if not.
 * Returns a normalized URL instance on success.
 */
function validateUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    throw new AppError(400, "MISSING_URL", "A URL is required.");
  }

  const trimmed = rawUrl.trim();
  let parsed;

  try {
    parsed = new URL(trimmed);
  } catch {
    throw new AppError(
      400,
      "INVALID_URL",
      `"${trimmed}" is not a valid URL. Include the protocol, e.g. https://example.com`
    );
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new AppError(
      400,
      "UNSUPPORTED_PROTOCOL",
      `Only http and https URLs are supported (got "${parsed.protocol}").`
    );
  }

  if (!parsed.hostname) {
    throw new AppError(400, "INVALID_URL", "The URL is missing a hostname.");
  }

  return parsed;
}

module.exports = validateUrl;
