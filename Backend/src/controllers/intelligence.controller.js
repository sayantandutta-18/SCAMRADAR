const {
  extractTextFromScreenshot,
  analyzeScamEvidence,
  analyzeUrlIntelligence,
  analyzeEmailIntelligence,
  getScamPatternGraph,
} = require("../services/intelligence.service");

// POST /api/intelligence/scan-ocr
const scanOcrController = async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "imageBase64 is required",
      });
    }

    const result = await extractTextFromScreenshot({ imageBase64, mimeType });
    return res.status(200).json(result);
  } catch (err) {
    console.error("scanOcrController error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to process screenshot OCR",
    });
  }
};

// POST /api/intelligence/analyze-evidence
const analyzeEvidenceController = async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text content is required for analysis",
      });
    }

    const analysis = await analyzeScamEvidence({ text, context });
    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    console.error("analyzeEvidenceController error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to analyze message content",
    });
  }
};

// POST /api/intelligence/analyze-url
const analyzeUrlController = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "URL string is required",
      });
    }

    const result = await analyzeUrlIntelligence(url);
    return res.status(200).json(result);
  } catch (err) {
    console.error("analyzeUrlController error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to analyze URL intelligence",
    });
  }
};

// POST /api/intelligence/analyze-email
const analyzeEmailController = async (req, res) => {
  try {
    const { emailContent, emailHeaders } = req.body;
    if (!emailContent || !emailContent.trim()) {
      return res.status(400).json({
        success: false,
        message: "emailContent is required",
      });
    }

    const result = await analyzeEmailIntelligence({ emailContent, emailHeaders });
    return res.status(200).json(result);
  } catch (err) {
    console.error("analyzeEmailController error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to analyze email intelligence",
    });
  }
};

// GET /api/intelligence/patterns
const getPatternGraphController = async (req, res) => {
  try {
    const { scamType, city, riskLevel, limit } = req.query;
    const graphData = await getScamPatternGraph({ scamType, city, riskLevel, limit });
    return res.status(200).json(graphData);
  } catch (err) {
    console.error("getPatternGraphController error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to generate scam pattern graph",
    });
  }
};

module.exports = {
  scanOcrController,
  analyzeEvidenceController,
  analyzeUrlController,
  analyzeEmailController,
  getPatternGraphController,
};
