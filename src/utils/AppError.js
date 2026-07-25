/**
 * A known, expected error with an HTTP status and a user-facing message.
 * Anything that is NOT an AppError is treated as unexpected and logged
 * as a 500, so callers never leak stack traces or crash the process.
 */
class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code; // short machine-readable code, e.g. "INVALID_URL"
  }
}

module.exports = AppError;
