const ScamAlert = require("../models/ScamAlert");
const ScamReport = require("../models/ScamReport");
const User = require("../models/User");

/**
 * Fetch alerts for a specific user with pagination and unread filter
 */
const getUserAlerts = async (userId, { unreadOnly = false, page = 1, limit = 20 } = {}) => {
  const query = { user: userId };
  if (unreadOnly) {
    query.isRead = false;
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [alerts, total, unreadCount] = await Promise.all([
    ScamAlert.find(query)
      .populate("relatedReportId", "title scamType riskScore riskLevel location status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ScamAlert.countDocuments(query),
    ScamAlert.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    alerts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
    unreadCount,
  };
};

/**
 * Mark a single alert as read
 */
const markAlertRead = async (alertId, userId) => {
  const alert = await ScamAlert.findOneAndUpdate(
    { _id: alertId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!alert) {
    throw new Error("Alert not found or access denied");
  }
  return alert;
};

/**
 * Mark all unread alerts for a user as read
 */
const markAllAlertsRead = async (userId) => {
  const result = await ScamAlert.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  return { updatedCount: result.modifiedCount };
};

/**
 * Generate threat alerts for user based on real ScamReport records matching user preferences
 */
const generateAlertsForUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const prefs = user.alertPreferences || {};
  if (prefs.inAppAlerts === false) {
    return { generated: 0, message: "In-app alerts are disabled in preferences" };
  }

  // Determine risk levels to match
  let allowedRiskLevels = ["HIGH"];
  if (prefs.minRiskLevel === "MEDIUM") {
    allowedRiskLevels = ["MEDIUM", "HIGH"];
  } else if (prefs.minRiskLevel === "LOW") {
    allowedRiskLevels = ["LOW", "MEDIUM", "HIGH"];
  }

  // Build report match query
  const reportQuery = {
    riskLevel: { $in: allowedRiskLevels },
  };

  if (prefs.categories && prefs.categories.length > 0) {
    reportQuery.scamType = { $in: prefs.categories };
  }

  if (prefs.locations && prefs.locations.length > 0) {
    reportQuery["location.city"] = { $in: prefs.locations };
  }

  // Get already alerted report IDs for this user
  const existingAlertReportIds = await ScamAlert.find({ user: userId }).distinct(
    "relatedReportId"
  );

  if (existingAlertReportIds.length > 0) {
    reportQuery._id = { $nin: existingAlertReportIds };
  }

  // Query actual threat reports from DB (max 10 to avoid notification explosion)
  const matchingReports = await ScamReport.find(reportQuery)
    .sort({ createdAt: -1 })
    .limit(10);

  const newAlerts = [];
  for (const report of matchingReports) {
    const cityName = report.location?.city ? ` in ${report.location.city}` : "";
    const categoryReadable = report.scamType.replace(/_/g, " ");

    const alert = new ScamAlert({
      user: userId,
      title: `Threat Alert: ${categoryReadable} Reported${cityName}`,
      message: `A ${report.riskLevel}-risk incident was registered: "${report.title}". Exercise vigilance when engaging with similar channels.`,
      scamType: report.scamType,
      riskLevel: report.riskLevel,
      city: report.location?.city || "National",
      relatedReportId: report._id,
      isRead: false,
    });

    try {
      await alert.save();
      newAlerts.push(alert);
    } catch (err) {
      // Ignore duplicate key collision due to compound index
    }
  }

  return {
    generated: newAlerts.length,
    alerts: newAlerts,
  };
};

/**
 * Get unread alert count for user
 */
const getUnreadCount = async (userId) => {
  const count = await ScamAlert.countDocuments({ user: userId, isRead: false });
  return { unreadCount: count };
};

module.exports = {
  getUserAlerts,
  markAlertRead,
  markAllAlertsRead,
  generateAlertsForUser,
  getUnreadCount,
};
