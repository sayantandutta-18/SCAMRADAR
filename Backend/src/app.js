const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const intelligenceRoutes = require("./routes/intelligence.routes");
const authRoutes = require("./routes/auth.routes");
const vaultRoutes = require("./routes/vault.routes");
const alertRoutes = require("./routes/alert.routes");
const moderationRoutes = require("./routes/moderation.routes");
const { generalLimiter } = require("./middleware/rateLimit.middleware");

const app = express();

// Global Security & Request Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// General rate limiter on all API requests
app.use("/api", generalLimiter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScamRadar API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mounted API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/moderation", moderationRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;