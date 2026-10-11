const express = require("express");
const router = express.Router();

const {
  scanOcrController,
  analyzeEvidenceController,
  analyzeUrlController,
  analyzeEmailController,
  getPatternGraphController,
} = require("../controllers/intelligence.controller");

// Checkpoint 8: Screenshot OCR & Message Threat Analysis
router.post("/scan-ocr", scanOcrController);
router.post("/analyze-evidence", analyzeEvidenceController);

// Checkpoint 9: URL & Email Intelligence
router.post("/analyze-url", analyzeUrlController);
router.post("/analyze-email", analyzeEmailController);

// Checkpoint 10: Scam Pattern Intelligence & Graph Correlation
router.get("/patterns", getPatternGraphController);

module.exports = router;
