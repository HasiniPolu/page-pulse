const AppError = require("../utils/AppError");

/**
 * Single place where every error in the app becomes a response.
 * Known failures (AppError) return their own status + message.
 * Anything unexpected is logged server-side and returned as a generic
 * 500 - the client never sees a raw stack trace.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong on our end. Try again." },
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: `No route for ${req.method} ${req.path}` },
  });
}

module.exports = { errorHandler, notFoundHandler };
