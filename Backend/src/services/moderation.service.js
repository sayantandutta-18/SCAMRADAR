const ScamReport = require("../models/ScamReport");
const ReportDispute = require("../models/ReportDispute");
const Identifier = require("../models/Identifier");

/**
 * Recalculate credibility score and level for a report
 */
const recalculateCredibility = async (reportId) => {
  const report = await ScamReport.findById(reportId);
  if (!report) return null;

  let score = 40; // Base baseline

  // 1. Evidence completeness signals
  if (report.suspectIdentifier && report.suspectIdentifier.value) {
    score += 15;
  }
  if (report.description && report.description.length > 80) {
    score += 10;
  }
  if (report.location && report.location.city) {
    score += 5;
  }

  // 2. Corroboration signals from normalized Identifiers
  let corroborationCount = 1;
  if (report.suspectIdentifier && report.suspectIdentifier.value) {
    const matchingIdentifier = await Identifier.findOne({
      value: report.suspectIdentifier.value.toLowerCase().trim(),
    });
    if (matchingIdentifier) {
      corroborationCount = Math.max(1, matchingIdentifier.reportsCount || 1);
      // Award up to +20 for multi-source corroboration
      const corroborationBonus = Math.min(20, (corroborationCount - 1) * 5);
      score += corroborationBonus;
    }
  }

  // 3. Moderator review signals
  const modStatus = report.credibility?.moderationStatus || "UNREVIEWED";
  if (modStatus === "VERIFIED_ACCURATE") {
    score += 20;
  } else if (modStatus === "FLAGGED_INACCURATE") {
    score -= 35;
  } else if (modStatus === "DISPUTED") {
    score -= 15;
  }

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine credibility level
  let level = "UNVERIFIED";
  if (finalScore >= 80 && corroborationCount >= 2) {
    level = "CORROBORATED";
  } else if (finalScore >= 75) {
    level = "HIGH";
  } else if (finalScore >= 50) {
    level = "MODERATE";
  }

  report.credibility = {
    ...report.credibility,
    score: finalScore,
    level,
    corroborationCount,
    moderationStatus: modStatus,
  };

  await report.save();
  return report.credibility;
};

/**
 * File a formal dispute against a report
 */
const fileDispute = async (reportId, disputeData) => {
  const report = await ScamReport.findById(reportId);
  if (!report) {
    throw new Error("Report not found");
  }

  const dispute = new ReportDispute({
    report: reportId,
    disputedBy: {
      name: disputeData.name || "Anonymous Requester",
      email: disputeData.email,
      relationship: disputeData.relationship || "Subject of Report",
    },
    reason: disputeData.reason,
    explanation: disputeData.explanation,
    supportingEvidence: disputeData.supportingEvidence || "",
    status: "PENDING",
  });

  await dispute.save();

  // Flag report as DISPUTED and recalculate score
  report.credibility = report.credibility || {};
  report.credibility.moderationStatus = "DISPUTED";
  await report.save();
  await recalculateCredibility(reportId);

  return dispute;
};

/**
 * List reports for moderation review
 */
const listReportsForModeration = async ({
  moderationStatus,
  scamType,
  page = 1,
  limit = 20,
} = {}) => {
  const query = {};
  if (moderationStatus) {
    query["credibility.moderationStatus"] = moderationStatus;
  }
  if (scamType) {
    query.scamType = scamType;
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [reports, total] = await Promise.all([
    ScamReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ScamReport.countDocuments(query),
  ]);

  return {
    reports,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Update report moderation status by moderator/admin
 */
const updateReportModeration = async (
  reportId,
  moderatorId,
  { moderationStatus, notes }
) => {
  const report = await ScamReport.findById(reportId);
  if (!report) {
    throw new Error("Report not found");
  }

  report.credibility = report.credibility || {};
  report.credibility.moderationStatus = moderationStatus;
  report.credibility.moderatedBy = moderatorId;
  report.credibility.moderatedAt = new Date();
  if (notes) {
    report.credibility.moderationNotes = notes;
  }

  await report.save();
  await recalculateCredibility(reportId);

  return report;
};

/**
 * List disputes for review
 */
const listDisputes = async ({ status, page = 1, limit = 20 } = {}) => {
  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (Math.max(1, page) - 1) * limit;

  const [disputes, total] = await Promise.all([
    ReportDispute.find(query)
      .populate("report", "title scamType riskScore location credibility createdAt")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ReportDispute.countDocuments(query),
  ]);

  return {
    disputes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Resolve dispute by moderator
 */
const resolveDispute = async (
  disputeId,
  moderatorId,
  { status, moderatorNotes, updateReportStatus }
) => {
  const dispute = await ReportDispute.findById(disputeId);
  if (!dispute) {
    throw new Error("Dispute not found");
  }

  dispute.status = status;
  dispute.moderatorNotes = moderatorNotes || "";
  dispute.reviewedBy = moderatorId;
  dispute.reviewedAt = new Date();
  await dispute.save();

  // If updateReportStatus specified or based on dispute resolution
  if (updateReportStatus) {
    await updateReportModeration(dispute.report, moderatorId, {
      moderationStatus: updateReportStatus,
      notes: `Dispute resolved as ${status}: ${moderatorNotes || ""}`,
    });
  } else if (status === "UPHELD") {
    // If dispute upheld, mark report as FLAGGED_INACCURATE
    await updateReportModeration(dispute.report, moderatorId, {
      moderationStatus: "FLAGGED_INACCURATE",
      notes: `Dispute upheld: ${moderatorNotes || ""}`,
    });
  } else if (status === "DISMISSED") {
    // If dispute dismissed, mark report as VERIFIED_ACCURATE
    await updateReportModeration(dispute.report, moderatorId, {
      moderationStatus: "VERIFIED_ACCURATE",
      notes: `Dispute dismissed after review: ${moderatorNotes || ""}`,
    });
  }

  return dispute;
};

module.exports = {
  recalculateCredibility,
  fileDispute,
  listReportsForModeration,
  updateReportModeration,
  listDisputes,
  resolveDispute,
};
