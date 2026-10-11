const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

// Public authentication endpoints protected by rate limiting
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

// Protected authenticated user endpoints
router.get("/me", authenticate, authController.getMe);
router.put("/preferences", authenticate, authController.updatePreferences);

module.exports = router;
