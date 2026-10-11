const express = require("express");

const {
  createReportController,
  getReportsController,
  searchReportsController,
  getReportByIdController,
  getReportStatsController,
  getMapReportsController,
} = require("../controllers/report.controller");

const {
  createReportSchema,
} = require("../validators/report.validator");

const router = express.Router();

// Validation middleware
const validateCreateReport = (req, res, next) => {
  const { error, value } = createReportSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};


// ================================
// CREATE REPORT
// POST /api/reports
// ================================
router.post(
  "/",
  validateCreateReport,
  createReportController
);


// ================================
// SEARCH REPORTS
// GET /api/reports/search
// ================================
router.get(
  "/search",
  searchReportsController
);


// ================================
// STATISTICS
// GET /api/reports/stats
// ================================
router.get(
  "/stats",
  getReportStatsController
);


// ================================
// MAP REPORTS
// GET /api/reports/map
// IMPORTANT: MUST COME BEFORE /:id
// ================================
router.get(
  "/map",
  getMapReportsController
);


// ================================
// GET REPORT BY ID
// GET /api/reports/:id
// ================================
router.get(
  "/:id",
  getReportByIdController
);


// ================================
// GET ALL REPORTS
// GET /api/reports
// ================================
router.get(
  "/",
  getReportsController
);


module.exports = router;