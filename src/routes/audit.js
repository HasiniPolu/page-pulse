const express = require("express");
const { runAudit } = require("../services/auditService");

const router = express.Router();

/**
 * POST /api/audit
 * Body: { "url": "https://example.com" }
 * 200 -> { data: <report> }
 * 4xx/5xx -> { error: { code, message } }  (see errorHandler middleware)
 */
router.post("/audit", async (req, res, next) => {
  try {
    const report = await runAudit(req.body?.url);
    res.status(200).json({ data: report });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
