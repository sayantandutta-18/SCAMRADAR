const alertService = require("../services/alert.service");

/**
 * Get user threat alerts
 */
const getAlerts = async (req, res) => {
  try {
    const { unreadOnly, page, limit } = req.query;
    const result = await alertService.getUserAlerts(req.user._id, {
      unreadOnly: unreadOnly === "true",
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.alerts,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve threat alerts",
    });
  }
};

/**
 * Mark a single alert as read
 */
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await alertService.markAlertRead(id, req.user._id);

    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      data: alert,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Alert not found",
    });
  }
};

/**
 * Mark all alerts as read
 */
const markAllRead = async (req, res) => {
  try {
    const result = await alertService.markAllAlertsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: "All alerts marked as read",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark alerts as read",
    });
  }
};

/**
 * Trigger alert sync/generation based on user preferences and recent reports
 */
const generateAlerts = async (req, res) => {
  try {
    const result = await alertService.generateAlertsForUser(req.user._id);

    res.status(200).json({
      success: true,
      message: `Generated ${result.generated} new threat alerts`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate alerts",
    });
  }
};

/**
 * Get count of unread alerts
 */
const getUnreadCount = async (req, res) => {
  try {
    const result = await alertService.getUnreadCount(req.user._id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get unread count",
    });
  }
};

module.exports = {
  getAlerts,
  markRead,
  markAllRead,
  generateAlerts,
  getUnreadCount,
};
