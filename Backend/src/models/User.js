const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Security Analyst",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't return password in normal queries
    },
    role: {
      type: String,
      enum: ["USER", "MODERATOR", "ADMIN"],
      default: "USER",
    },
    walletAddress: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    // Configurable Threat Alert Preferences
    alertPreferences: {
      categories: {
        type: [String],
        default: [
          "KYC_SCAM",
          "UPI_FRAUD",
          "PHISHING",
          "JOB_SCAM",
          "IMPERSONATION",
          "INVESTMENT_SCAM",
        ],
      },
      minRiskLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "MEDIUM",
      },
      locations: {
        type: [String],
        default: [],
      },
      inAppAlerts: {
        type: Boolean,
        default: true,
      },
      browserNotifications: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
