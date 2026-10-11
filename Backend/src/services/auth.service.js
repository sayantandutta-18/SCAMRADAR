const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

/**
 * Generate signed JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
};

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password, role }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("A user with this email address already exists");
  }

  // Validate allowed roles (default to USER, prevent casual ADMIN creation)
  const safeRole = role && ["USER", "MODERATOR"].includes(role) ? role : "USER";

  const user = new User({
    name: name?.trim() || "Security Analyst",
    email: normalizedEmail,
    password,
    role: safeRole,
  });

  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      alertPreferences: user.alertPreferences,
    },
  };
};

/**
 * Authenticate user credentials
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      alertPreferences: user.alertPreferences,
    },
  };
};

/**
 * Get user profile by ID
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

/**
 * Update user alert preferences
 */
const updatePreferences = async (userId, preferences) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (preferences.categories) user.alertPreferences.categories = preferences.categories;
  if (preferences.minRiskLevel) user.alertPreferences.minRiskLevel = preferences.minRiskLevel;
  if (preferences.locations !== undefined) user.alertPreferences.locations = preferences.locations;
  if (preferences.inAppAlerts !== undefined) user.alertPreferences.inAppAlerts = preferences.inAppAlerts;
  if (preferences.browserNotifications !== undefined) user.alertPreferences.browserNotifications = preferences.browserNotifications;

  await user.save();
  return user.alertPreferences;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePreferences,
};
