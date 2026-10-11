const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");
const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
// Health check route
app.get("/api/health",(req,res) => {
    res.status(200).json({
        success: true,
        message: "ScamRadar API is running",
    });
});

module.exports = app;