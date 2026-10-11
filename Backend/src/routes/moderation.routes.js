const express = require("express");
const router = express.Router();
const moderationController = require("../controllers/moderation.controller");
const { authenticate, requireRole, optionalAuth } = require("../middleware/auth.middleware");

// Public/Optional auth dispute submission
router.post("/reports/:id/dispute", optionalAuth, moderationController.fileDispute);

// Role-protected moderator/admin console routes
router.use(authenticate);
router.use(requireRole(["MODERATOR", "ADMIN"]));

router.get("/reports", moderationController.listReports);
router.put("/reports/:id/status", moderationController.updateReportStatus);
router.get("/disputes", moderationController.listDisputes);
router.put("/disputes/:id/resolve", moderationController.resolveDispute);

module.exports = router;
