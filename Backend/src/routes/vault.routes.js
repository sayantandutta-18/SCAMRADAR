const express = require("express");
const router = express.Router();
const vaultController = require("../controllers/vault.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Enforce strict authentication on all vault operations
router.use(authenticate);

router.post("/cases", vaultController.createCase);
router.get("/cases", vaultController.getCases);
router.get("/cases/:id", vaultController.getCaseById);
router.put("/cases/:id", vaultController.updateCase);
router.delete("/cases/:id", vaultController.deleteCase);

// Sub-resources on cases
router.post("/cases/:id/timeline", vaultController.addTimelineEvent);
router.post("/cases/:id/notes", vaultController.addNote);
router.post("/cases/:id/files", vaultController.addFile);
router.post("/cases/:id/transactions", vaultController.addTransaction);

module.exports = router;
