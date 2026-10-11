const mongoose = require("mongoose");

const identifierSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["PHONE", "UPI", "URL", "EMAIL", "SOCIAL_MEDIA"],
      index: true,
    },
    reportCount: {
      type: Number,
      default: 1,
    },
    latestRiskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    latestRiskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "UNKNOWN"],
      default: "UNKNOWN",
    },
    lastReportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Identifier = mongoose.model("Identifier", identifierSchema);

module.exports = Identifier;
