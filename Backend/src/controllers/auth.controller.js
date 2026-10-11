const authService = require("../services/auth.service");

/**
 * User Registration Controller
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * User Login Controller
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

/**
 * Get Current User Profile Controller
 */
const getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "User profile not found",
    });
  }
};

/**
 * Update User Alert Preferences Controller
 */
const updatePreferences = async (req, res) => {
  try {
    const updatedPreferences = await authService.updatePreferences(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Threat alert preferences updated successfully",
      data: updatedPreferences,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update preferences",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updatePreferences,
};
