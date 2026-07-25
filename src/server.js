const path = require("path");
const express = require("express");
const auditRouter = require("./routes/audit");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", auditRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Page Pulse listening on http://localhost:${PORT}`);
});

module.exports = app;
