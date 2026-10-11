const mongoose = require("mongoose");

const evidenceCaseSchema = new mongoose.Schema(
  {
    // Case owner - strictly isolated per user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    scamType: {
      type: String,
      trim: true,
      default: "OTHER",
    },
    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "SUBMITTED_TO_AUTHORITIES", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },
    suspectIdentifier: {
      type: {
        type: String,
        trim: true,
      },
      value: {
        type: String,
        trim: true,
      },
    },
    financialLoss: {
      amount: {
        type: Number,
        default: 0,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
      recoveredAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    transactionReferences: [
      {
        referenceId: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
        },
        platform: {
          type: String,
          trim: true,
        },
        amount: {
          type: Number,
          min: 0,
        },
      },
    ],
    // Vault evidence files (stored safely with strict validation)
    evidenceFiles: [
      {
        filename: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        fileData: {
          type: String, // base64 / data-URI
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Chronological case incident events
    timeline: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        addedBy: {
          type: String,
          default: "Victim",
        },
      },
    ],
    // Private victim investigation notes
    notes: [
      {
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    retentionDays: {
      type: Number,
      default: 365,
    },
    isVaultEncrypted: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate case number pre-validation if not provided
evidenceCaseSchema.pre("validate", function (next) {
  if (!this.caseNumber) {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    this.caseNumber = `SR-CASE-${year}-${rand}`;
  }
  if (typeof next === "function") next();
});

const EvidenceCase = mongoose.model("EvidenceCase", evidenceCaseSchema);

module.exports = EvidenceCase;
