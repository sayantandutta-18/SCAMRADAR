const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alert.controller");
const { authenticate } = require("../middleware/auth.middleware");

// All alert endpoints require authentication
router.use(authenticate);

router.get("/", alertController.getAlerts);
router.get("/unread-count", alertController.getUnreadCount);
router.post("/generate", alertController.generateAlerts);
router.put("/read-all", alertController.markAllRead);
router.put("/:id/read", alertController.markRead);

module.exports = router;
