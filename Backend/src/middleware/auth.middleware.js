const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

/**
 * Authenticate incoming requests via Bearer JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: No bearer token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: Invalid token format",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Token has expired",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Authentication failed: Invalid token",
    });
  }
};

/**
 * Optional authentication: attaches user if token is valid, continues if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
};

/**
 * Role-Based Access Control Middleware Factory
 * @param {string[]} allowedRoles - Array of roles allowed, e.g. ["MODERATOR", "ADMIN"]
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(", ")}] roles`,
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
};
