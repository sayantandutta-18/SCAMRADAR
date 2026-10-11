const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScamReport",
      required: true,
      index: true,
    },
    rawMessage: {
      type: String,
      required: true,
    },
    scamType: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "UNKNOWN"],
    },
    explanation: {
      type: String,
      required: true,
    },
    modelUsed: {
      type: String,
      default: "gemini-3.1-flash-lite",
    },
  },
  {
    timestamps: true,
  }
);

const AiAnalysis = mongoose.model("AiAnalysis", aiAnalysisSchema);

module.exports = AiAnalysis;
