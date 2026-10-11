const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const intelligenceRoutes = require("./routes/intelligence.routes");
const app = express();

// Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/intelligence", intelligenceRoutes);
// Health check route
app.get("/api/health",(req,res) => {
    res.status(200).json({
        success: true,
        message: "ScamRadar API is running",
    });
});

module.exports = app;