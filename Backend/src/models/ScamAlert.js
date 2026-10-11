const mongoose = require("mongoose");

const scamAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    scamType: {
      type: String,
      required: true,
      trim: true,
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    city: {
      type: String,
      trim: true,
    },
    relatedReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScamReport",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate alerts for the same user and report
scamAlertSchema.index({ user: 1, relatedReportId: 1 }, { unique: true, sparse: true });

const ScamAlert = mongoose.model("ScamAlert", scamAlertSchema);

module.exports = ScamAlert;
