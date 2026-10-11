const vaultService = require("../services/vault.service");

/**
 * Create a new private case dossier
 */
const createCase = async (req, res) => {
  try {
    const newCase = await vaultService.createCase(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Evidence dossier created successfully",
      data: newCase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create evidence dossier",
    });
  }
};

/**
 * List all cases belonging to current user
 */
const getCases = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await vaultService.getUserCases(req.user._id, {
      status,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.cases,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve evidence dossiers",
    });
  }
};

/**
 * Retrieve single case by ID
 */
const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await vaultService.getCaseById(id, req.user._id);

    res.status(200).json({
      success: true,
      data: dossier,
    });
  } catch (error) {
    const statusCode = error.message.includes("Unauthorized") ? 403 : 404;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Case not found",
    });
  }
};

/**
 * Update case dossier
 */
const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await vaultService.updateCase(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Case dossier updated successfully",
      data: updated,
    });
  } catch (error) {
    const statusCode = error.message.includes("Unauthorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update case dossier",
    });
  }
};

/**
 * Delete case dossier
 */
const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await vaultService.deleteCase(id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    const statusCode = error.message.includes("Unauthorized") ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete case dossier",
    });
  }
};

/**
 * Add timeline milestone to case
 */
const addTimelineEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const timeline = await vaultService.addTimelineEvent(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Milestone added to case timeline",
      data: timeline,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add timeline milestone",
    });
  }
};

/**
 * Add private note to case
 */
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const notes = await vaultService.addCaseNote(id, req.user._id, content);

    res.status(200).json({
      success: true,
      message: "Private note appended to case",
      data: notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add note",
    });
  }
};

/**
 * Upload evidence file to case
 */
const addFile = async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await vaultService.addEvidenceFile(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Evidence file uploaded securely to vault",
      data: dossier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to upload evidence file",
    });
  }
};

/**
 * Add transaction reference (UTR/TxID)
 */
const addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const dossier = await vaultService.addTransactionReference(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Transaction reference logged to case",
      data: dossier,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to log transaction reference",
    });
  }
};

module.exports = {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  addTimelineEvent,
  addNote,
  addFile,
  addTransaction,
};
