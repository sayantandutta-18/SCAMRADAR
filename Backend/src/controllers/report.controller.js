const {
  createReport,
  getReports,
  searchReportsByIdentifier,
  getReportById,
  getReportStats,
  getMapReports,
} = require("../services/report.service");

// ========================================
// CREATE A NEW SCAM REPORT
// ========================================
const createReportController = async (req, res) => {
  try {
    const report = await createReport(req.body);

    return res.status(201).json({
      success: true,
      message: "Scam report created successfully",
      data: report,
    });
  } catch (error) {
    console.error("Create report error:", error.message);

    // Duplicate identifier
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
        existingReport: error.existingReport,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create scam report",
    });
  }
};


// ========================================
// GET ALL SCAM REPORTS
// ========================================
const getReportsController = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      scamType,
      city,
      state,
    } = req.query;

    const result = await getReports({
      page,
      limit,
      scamType,
      city,
      state,
    });

    return res.status(200).json({
      success: true,
      ...result,
      data: result.reports,
    });
  } catch (error) {
    console.error("Get reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch scam reports",
    });
  }
};


// ========================================
// SEARCH SCAM REPORTS BY IDENTIFIER
// ========================================
const searchReportsController = async (req, res) => {
  try {
    const { identifier, identifierType } = req.query;

    if (!identifier || !identifierType) {
      return res.status(400).json({
        success: false,
        message: "Identifier and identifierType are required",
      });
    }

    const reports = await searchReportsByIdentifier(
      identifier,
      identifierType
    );

    return res.status(200).json({
      success: true,
      found: reports.length > 0,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Search reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to search scam reports",
    });
  }
};


// ========================================
// GET SINGLE SCAM REPORT BY ID
// ========================================
const getReportByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await getReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Scam report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report by ID error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Invalid report ID",
    });
  }
};


// ========================================
// GET SCAM REPORT STATISTICS
// ========================================
const getReportStatsController = async (req, res) => {
  try {
    const stats = await getReportStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get report stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report statistics",
    });
  }
};


// ========================================
// GET SCAM REPORTS FOR MAP
// ========================================
const getMapReportsController = async (req, res) => {
  try {
    const reports = await getMapReports();

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Get map reports error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch map reports",
    });
  }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================
module.exports = {
  createReportController,
  getReportsController,
  searchReportsController,
  getReportByIdController,
  getReportStatsController,
  getMapReportsController,
};