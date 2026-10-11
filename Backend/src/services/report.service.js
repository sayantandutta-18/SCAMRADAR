const ScamReport = require("../models/ScamReport");
const { normalizeIdentifier } = require("../utils/identifier.util");
const { analyzeScamMessage } = require("./ai.service");

const {
  registerReport,
  getBlockchainReport,
  verifyReport,
} = require("./blockchain.service");

const crypto = require("crypto");


// =====================================================
// CREATE A NEW SCAM REPORT
// =====================================================

const createReport = async (reportData) => {

  // Normalize identifier before saving
  const normalizedIdentifier = normalizeIdentifier(
    reportData.identifier,
    reportData.identifierType
  );

  // Check duplicate identifier
  const existingReport = await ScamReport.findOne({
    identifier: normalizedIdentifier,
  });

  if (existingReport) {
    const error = new Error(
      "This identifier has already been reported"
    );

    error.statusCode = 409;
    error.existingReport = existingReport;

    throw error;
  }

  // ===================================================
  // AI ANALYSIS
  // ===================================================

  const aiAnalysis = await analyzeScamMessage(
    reportData.message
  );

  // ===================================================
  // SAVE REPORT TO MONGODB
  // ===================================================

  const report = await ScamReport.create({
    ...reportData,

    identifier: normalizedIdentifier,

    scamType: aiAnalysis.scamType,

    riskScore: aiAnalysis.riskScore,

    riskLevel: aiAnalysis.riskLevel,

    aiExplanation: aiAnalysis.explanation,

    blockchain: {
      registered: false,
    },
  });


  // ===================================================
  // BLOCKCHAIN REGISTRATION
  // ===================================================

  try {

    // Data used to generate immutable hash
    const reportDataForHash = JSON.stringify({
      reportId: report._id.toString(),
      identifier: report.identifier,
      identifierType: report.identifierType,
      message: report.message,
      scamType: report.scamType,
      riskScore: report.riskScore,
      riskLevel: report.riskLevel,
      createdAt: report.createdAt,
    });

    // Generate SHA-256 hash
    const hash = crypto
      .createHash("sha256")
      .update(reportDataForHash)
      .digest("hex");

    // Convert SHA-256 hash to bytes32 format
    const reportHash = `0x${hash}`;

    // Register report on blockchain
    const blockchainResult = await registerReport(
      report._id.toString(),
      reportHash
    );

    // Save blockchain information to MongoDB
    report.blockchain = {
      registered: true,
      reportHash: reportHash,
      transactionHash:
        blockchainResult.transactionHash,
      timestamp: new Date(),
    };

    await report.save();

    console.log(
      `Blockchain registration successful for report ${report._id}`
    );

  } catch (blockchainError) {

    console.error(
      "Blockchain registration failed:",
      blockchainError.message
    );

    // Keep report in MongoDB even if blockchain fails
    report.blockchain = {
      registered: false,
      reportHash: null,
      transactionHash: null,
      timestamp: null,
    };

    await report.save();
  }


  return report;
};


// =====================================================
// GET ALL SCAM REPORTS (WITH ADVANCED MULTI-PARAMETER FILTERS)
// =====================================================

const getReports = async (filters = {}) => {
  const {
    page = 1,
    limit = 10,
    scamType,
    city,
    state,
    riskLevel,
    minRisk,
    search,
    startDate,
    endDate,
    moderationStatus,
    status,
  } = filters;

  const query = {};

  if (scamType) {
    query.scamType = scamType;
  }

  if (city) {
    query["location.city"] = new RegExp(`^${city}$`, "i");
  }

  if (state) {
    query["location.state"] = new RegExp(`^${state}$`, "i");
  }

  if (riskLevel) {
    query.riskLevel = riskLevel.toUpperCase();
  }

  if (minRisk) {
    query.riskScore = { $gte: Number(minRisk) };
  }

  if (moderationStatus) {
    query["credibility.moderationStatus"] = moderationStatus;
  }

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: "i" } },
      { message: { $regex: s, $options: "i" } },
      { identifier: { $regex: s, $options: "i" } },
      { "location.city": { $regex: s, $options: "i" } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * Number(limit);

  const [reports, total] = await Promise.all([
    ScamReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),

    ScamReport.countDocuments(query),
  ]);

  return {
    reports,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / Number(limit)) || 1,
  };
};


// =====================================================
// SEARCH REPORTS BY IDENTIFIER
// =====================================================

const searchReportsByIdentifier = async (
  identifier,
  identifierType
) => {

  const normalizedIdentifier = normalizeIdentifier(
    identifier,
    identifierType
  );

  const reports = await ScamReport
    .find({
      identifier: normalizedIdentifier,
    })
    .sort({ createdAt: -1 });

  return reports;
};


// =====================================================
// GET REPORT BY ID
// =====================================================

const getReportById = async (reportId) => {

  const report = await ScamReport.findById(reportId);

  return report;
};


// =====================================================
// GET REPORT STATISTICS
// =====================================================

const getReportStats = async () => {

  const [
    totalReports,
    highRiskReports,
    scamTypeStats,
    cityStats,
  ] = await Promise.all([

    // Total reports
    ScamReport.countDocuments(),

    // High-risk reports
    ScamReport.countDocuments({
      riskLevel: "HIGH",
    }),

    // Scam type statistics
    ScamReport.aggregate([
      {
        $group: {
          _id: "$scamType",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]),

    // City statistics
    ScamReport.aggregate([
      {
        $group: {
          _id: "$location.city",
          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },
    ]),
  ]);

  return {
    totalReports,
    highRiskReports,
    scamTypeStats,
    cityStats,
  };
};


// =====================================================
// GET SCAM REPORTS FOR MAP
// =====================================================

const getMapReports = async () => {

  const reports = await ScamReport.find(
    {
      "location.latitude": {
        $exists: true,
      },

      "location.longitude": {
        $exists: true,
      },
    },

    {
      _id: 1,

      "location.city": 1,
      "location.state": 1,
      "location.latitude": 1,
      "location.longitude": 1,

      scamType: 1,
      riskScore: 1,
      riskLevel: 1,
      status: 1,

      blockchain: 1,
    }
  ).sort({
    createdAt: -1,
  });

  return reports;
};


// =====================================================
// VERIFY REPORT ON BLOCKCHAIN (EXACT CANONICAL PAYLOAD)
// =====================================================

const verifyReportOnChain = async (reportId) => {
  if (!reportId) {
    const error = new Error("Report ID is required");
    error.statusCode = 400;
    throw error;
  }

  const report = await ScamReport.findById(reportId);
  if (!report) {
    const error = new Error("Scam report not found");
    error.statusCode = 404;
    throw error;
  }

  // Exact canonical payload used during registration
  const canonicalPayload = {
    reportId: report._id.toString(),
    identifier: report.identifier,
    identifierType: report.identifierType,
    message: report.message,
    scamType: report.scamType,
    riskScore: report.riskScore,
    riskLevel: report.riskLevel,
    createdAt: report.createdAt,
  };

  const reportDataForHash = JSON.stringify(canonicalPayload);
  const hash = crypto.createHash("sha256").update(reportDataForHash).digest("hex");
  const calculatedHash = `0x${hash}`;

  let onChain = null;
  let rpcError = null;

  try {
    onChain = await getBlockchainReport(report._id.toString());
  } catch (err) {
    rpcError = err.message || "Failed to query blockchain smart contract";
  }

  const reportMeta = {
    _id: report._id.toString(),
    identifier: report.identifier,
    identifierType: report.identifierType,
    scamType: report.scamType,
    riskScore: report.riskScore,
    riskLevel: report.riskLevel,
    status: report.status,
    createdAt: report.createdAt,
    location: report.location,
  };

  if (rpcError) {
    return {
      success: true,
      reportId: report._id.toString(),
      status: "RPC_UNAVAILABLE",
      verified: false,
      calculatedHash,
      databaseBlockchain: report.blockchain,
      rpcError,
      canonicalPayload,
      report: reportMeta,
    };
  }

  if (!onChain || !onChain.exists) {
    return {
      success: true,
      reportId: report._id.toString(),
      status: "NOT_REGISTERED_ON_CHAIN",
      verified: false,
      calculatedHash,
      onChain: null,
      databaseBlockchain: report.blockchain,
      canonicalPayload,
      report: reportMeta,
    };
  }

  const isHashMatch =
    typeof onChain.reportHash === "string" &&
    onChain.reportHash.toLowerCase() === calculatedHash.toLowerCase();

  return {
    success: true,
    reportId: report._id.toString(),
    status: isHashMatch ? "VERIFIED" : "HASH_MISMATCH",
    verified: isHashMatch,
    calculatedHash,
    onChain: {
      reportHash: onChain.reportHash,
      timestamp: onChain.timestamp,
      submittedBy: onChain.submittedBy,
      exists: true,
    },
    databaseBlockchain: report.blockchain,
    canonicalPayload,
    report: reportMeta,
  };
};


// =====================================================
// TIME-SERIES TRENDS (REAL DATABASE AGGREGATION)
// =====================================================

const getTimeSeriesTrends = async ({ interval = "day", days = 30 } = {}) => {
  const daysNum = Math.min(365, Math.max(7, Number(days) || 30));
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysNum);

  let dateFormat = "%Y-%m-%d";
  if (interval === "month") {
    dateFormat = "%Y-%m";
  } else if (interval === "week") {
    dateFormat = "%Y-W%V";
  }

  const trends = await ScamReport.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        totalReports: { $sum: 1 },
        highRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "HIGH"] }, 1, 0] },
        },
        avgRiskScore: { $avg: "$riskScore" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    interval,
    days: daysNum,
    startDate,
    trends: trends.map((t) => ({
      date: t._id,
      totalReports: t.totalReports,
      highRiskCount: t.highRiskCount,
      avgRiskScore: Math.round(t.avgRiskScore || 0),
    })),
  };
};

// =====================================================
// CATEGORY DEEP-DIVE ANALYTICS
// =====================================================

const getCategoryAnalytics = async () => {
  const analytics = await ScamReport.aggregate([
    {
      $group: {
        _id: "$scamType",
        count: { $sum: 1 },
        avgRiskScore: { $avg: "$riskScore" },
        highRiskCount: {
          $sum: { $cond: [{ $eq: ["$riskLevel", "HIGH"] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const total = analytics.reduce((acc, curr) => acc + curr.count, 0);

  return analytics.map((cat) => ({
    category: cat._id,
    count: cat.count,
    percentage: total > 0 ? Math.round((cat.count / total) * 100) : 0,
    avgRiskScore: Math.round(cat.avgRiskScore || 0),
    highRiskCount: cat.highRiskCount,
  }));
};

// =====================================================
// GEOGRAPHIC THREAT HOTSPOTS
// =====================================================

const getGeographicHotspots = async () => {
  const hotspots = await ScamReport.aggregate([
    {
      $match: {
        "location.city": { $exists: true, $ne: "" },
      },
    },
    {
      $group: {
        _id: "$location.city",
        state: { $first: "$location.state" },
        latitude: { $first: "$location.latitude" },
        longitude: { $first: "$location.longitude" },
        count: { $sum: 1 },
        avgRiskScore: { $avg: "$riskScore" },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 15,
    },
  ]);

  return hotspots.map((h) => ({
    city: h._id,
    state: h.state,
    latitude: h.latitude,
    longitude: h.longitude,
    count: h.count,
    avgRiskScore: Math.round(h.avgRiskScore || 0),
  }));
};

module.exports = {
  createReport,
  getReports,
  searchReportsByIdentifier,
  getReportById,
  getReportStats,
  getMapReports,
  verifyReportOnChain,
  getTimeSeriesTrends,
  getCategoryAnalytics,
  getGeographicHotspots,
};