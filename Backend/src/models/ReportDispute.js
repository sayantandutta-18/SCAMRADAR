const mongoose = require("mongoose");

const reportDisputeSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScamReport",
      required: true,
      index: true,
    },
    disputedBy: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      relationship: {
        type: String,
        trim: true,
        default: "Subject of Report",
      },
    },
    reason: {
      type: String,
      enum: [
        "NOT_A_SCAM",
        "INCORRECT_DETAILS",
        "IMPERSONATION_OF_LEGITIMATE_ENTITY",
        "RESOLVED_DISPUTE",
        "OTHER",
      ],
      required: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    supportingEvidence: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "DISMISSED", "UPHELD"],
      default: "PENDING",
      index: true,
    },
    moderatorNotes: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ReportDispute = mongoose.model("ReportDispute", reportDisputeSchema);

module.exports = ReportDispute;
