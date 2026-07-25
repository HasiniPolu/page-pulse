const AppError = require("../utils/AppError");

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_BODY_BYTES = 5 * 1024 * 1024; // 5MB safety cap so huge pages can't hang the audit

/**
 * Fetches a URL with a hard timeout, and reads the body with a size cap.
 * Returns { status, headers, body, elapsedMs }.
 * Translates every failure mode (timeout, DNS, refused, oversized) into
 * a specific AppError so the route layer never has to guess what went wrong.
 */
async function fetchPage(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  let response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "PagePulse/1.0 (+https://digitalheroesco.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new AppError(
        504,
        "TIMEOUT",
        `The page took longer than ${timeoutMs / 1000}s to respond.`
      );
    }
    // Node's fetch wraps DNS/connection failures in a generic TypeError
    throw new AppError(
      502,
      "UNREACHABLE",
      `Could not reach that URL (${err.cause?.code || err.message}).`
    );
  } finally {
    clearTimeout(timer);
  }

  const contentType = response.headers.get("content-type") || "";
  const contentLength = Number(response.headers.get("content-length") || 0);

  if (contentLength > MAX_BODY_BYTES) {
    throw new AppError(
      413,
      "PAGE_TOO_LARGE",
      `The page is too large to audit (${Math.round(contentLength / 1024 / 1024)}MB, limit is 5MB).`
    );
  }

  // Read the body ourselves so we can enforce the size cap even when
  // content-length is missing or lying.
  let body = "";
  try {
    const reader = response.body?.getReader?.();
    if (reader) {
      let received = 0;
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        if (received > MAX_BODY_BYTES) {
          throw new AppError(413, "PAGE_TOO_LARGE", "The page is too large to audit (over 5MB).");
        }
        body += decoder.decode(value, { stream: true });
      }
    } else {
      body = await response.text();
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "READ_FAILED", "The page's response could not be read in full.");
  }

  return {
    status: response.status,
    ok: response.ok,
    contentType,
    body,
    elapsedMs: Date.now() - startedAt,
    finalUrl: response.url,
  };
}

module.exports = { fetchPage, DEFAULT_TIMEOUT_MS };
