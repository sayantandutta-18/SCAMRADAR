const moderationService = require("../services/moderation.service");

/**
 * Public or user-initiated dispute submission
 */
const fileDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, relationship, reason, explanation, supportingEvidence } = req.body;

    if (!reason || !explanation || !email) {
      return res.status(400).json({
        success: false,
        message: "Email, dispute reason, and explanation are required",
      });
    }

    const dispute = await moderationService.fileDispute(id, {
      name,
      email,
      relationship,
      reason,
      explanation,
      supportingEvidence,
    });

    res.status(201).json({
      success: true,
      message: "Dispute submitted successfully and marked under review",
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to file report dispute",
    });
  }
};

/**
 * List reports for moderation (moderators/admins)
 */
const listReports = async (req, res) => {
  try {
    const { moderationStatus, scamType, page, limit } = req.query;
    const result = await moderationService.listReportsForModeration({
      moderationStatus,
      scamType,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.reports,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch moderation reports",
    });
  }
};

/**
 * Update report moderation status (moderators/admins)
 */
const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { moderationStatus, notes } = req.body;

    if (!moderationStatus) {
      return res.status(400).json({
        success: false,
        message: "moderationStatus is required",
      });
    }

    const report = await moderationService.updateReportModeration(
      id,
      req.user._id,
      { moderationStatus, notes }
    );

    res.status(200).json({
      success: true,
      message: "Report moderation status updated and credibility recalculated",
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update moderation status",
    });
  }
};

/**
 * List disputes (moderators/admins)
 */
const listDisputes = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const result = await moderationService.listDisputes({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.disputes,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch disputes",
    });
  }
};

/**
 * Resolve dispute (moderators/admins)
 */
const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, moderatorNotes, updateReportStatus } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Resolution status is required",
      });
    }

    const dispute = await moderationService.resolveDispute(
      id,
      req.user._id,
      { status, moderatorNotes, updateReportStatus }
    );

    res.status(200).json({
      success: true,
      message: "Dispute resolved successfully",
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to resolve dispute",
    });
  }
};

module.exports = {
  fileDispute,
  listReports,
  updateReportStatus,
  listDisputes,
  resolveDispute,
};
