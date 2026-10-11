const mongoose = require("mongoose");

const scamReportSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
    },

    identifierType: {
      type: String,
      required: true,
      enum: ["PHONE", "UPI", "URL", "EMAIL", "SOCIAL_MEDIA"],
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    scamType: {
      type: String,
      required: true,
      enum: [
        "PHISHING",
        "JOB_SCAM",
        "UPI_FRAUD",
        "LOAN_SCAM",
        "INVESTMENT_SCAM",
        "KYC_SCAM",
        "LOTTERY_SCAM",
        "IMPERSONATION",
        "DELIVERY_SCAM",
        "ROMANCE_SCAM",
        "TECH_SUPPORT_SCAM",
        "OTHER",
      ],
    },

    // AI-generated risk score
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    // AI-generated risk level
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "UNKNOWN"],
    },

    // AI-generated explanation
    aiExplanation: {
      type: String,
      maxlength: 1000,
    },

    // Report location
    location: {
      city: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },

    // Blockchain verification data
    blockchain: {
      registered: {
        type: Boolean,
        default: false,
      },

      reportHash: {
        type: String,
        default: null,
      },

      transactionHash: {
        type: String,
        default: null,
      },

      timestamp: {
        type: Date,
        default: null,
      },
    },

    // Report status
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    // User who submitted the report
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ScamReport = mongoose.model(
  "ScamReport",
  scamReportSchema
);

module.exports = ScamReport;