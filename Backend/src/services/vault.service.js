const EvidenceCase = require("../models/EvidenceCase");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validate evidence file metadata and payload
 */
const validateFile = (file) => {
  if (!file.filename || !file.fileType || !file.fileData) {
    throw new Error("Invalid evidence file: filename, fileType, and fileData are required");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.fileType.toLowerCase())) {
    throw new Error(
      `Unsupported file type '${file.fileType}'. Allowed types: JPG, PNG, WEBP, PDF, TXT`
    );
  }

  // Check approximate payload size if size not explicitly passed
  const approxSize = file.fileSize || Math.round((file.fileData.length * 3) / 4);
  if (approxSize > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds maximum allowed size of 5 MB");
  }

  return {
    filename: file.filename.trim(),
    fileType: file.fileType.toLowerCase(),
    fileSize: approxSize,
    fileData: file.fileData,
    uploadedAt: new Date(),
  };
};

/**
 * Create a new private evidence dossier for the authenticated user
 */
const createCase = async (userId, data) => {
  if (!data.caseTitle || data.caseTitle.trim().length === 0) {
    throw new Error("Case title is required");
  }

  const validatedFiles = [];
  if (data.evidenceFiles && Array.isArray(data.evidenceFiles)) {
    for (const f of data.evidenceFiles) {
      validatedFiles.push(validateFile(f));
    }
  }

  const initialTimeline = [
    {
      timestamp: new Date(),
      title: "Case Dossier Initialized",
      description: "Private incident dossier created in encrypted evidence vault.",
      addedBy: "System",
    },
  ];

  if (data.timeline && Array.isArray(data.timeline)) {
    for (const item of data.timeline) {
      if (item.title) {
        initialTimeline.push({
          timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
          title: item.title,
          description: item.description || "",
          addedBy: item.addedBy || "Victim",
        });
      }
    }
  }

  const newCase = new EvidenceCase({
    user: userId,
    caseTitle: data.caseTitle.trim(),
    scamType: data.scamType || "OTHER",
    status: data.status || "OPEN",
    suspectIdentifier: {
      type: data.suspectIdentifier?.type || "PHONE",
      value: data.suspectIdentifier?.value?.trim() || "",
    },
    financialLoss: {
      amount: Number(data.financialLoss?.amount) || 0,
      currency: data.financialLoss?.currency || "INR",
      recoveredAmount: Number(data.financialLoss?.recoveredAmount) || 0,
    },
    transactionReferences: Array.isArray(data.transactionReferences)
      ? data.transactionReferences
      : [],
    evidenceFiles: validatedFiles,
    timeline: initialTimeline,
    notes: data.initialNote
      ? [{ content: data.initialNote, createdAt: new Date() }]
      : [],
    retentionDays: data.retentionDays || 365,
  });

  await newCase.save();
  return newCase;
};

/**
 * Get cases belonging exclusively to the authenticated user
 */
const getUserCases = async (userId, { status, search, page = 1, limit = 20 } = {}) => {
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { caseTitle: { $regex: search, $options: "i" } },
      { caseNumber: { $regex: search, $options: "i" } },
      { "suspectIdentifier.value": { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * limit;

  // Project out fileData in list queries to minimize bandwidth
  const [cases, total] = await Promise.all([
    EvidenceCase.find(query)
      .select("-evidenceFiles.fileData")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    EvidenceCase.countDocuments(query),
  ]);

  return {
    cases,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get full case by ID with strict user authorization check
 */
const getCaseById = async (caseId, userId) => {
  const dossier = await EvidenceCase.findById(caseId);

  if (!dossier) {
    throw new Error("Case dossier not found");
  }

  if (dossier.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized: You do not have permission to view this case");
  }

  return dossier;
};

/**
 * Update case dossier
 */
const updateCase = async (caseId, userId, updateData) => {
  const dossier = await getCaseById(caseId, userId);

  if (updateData.caseTitle) dossier.caseTitle = updateData.caseTitle.trim();
  if (updateData.scamType) dossier.scamType = updateData.scamType;
  if (updateData.status && updateData.status !== dossier.status) {
    dossier.timeline.push({
      timestamp: new Date(),
      title: `Status Changed to ${updateData.status}`,
      description: `Case investigation status transitioned from ${dossier.status} to ${updateData.status}`,
      addedBy: "User",
    });
    dossier.status = updateData.status;
  }
  if (updateData.suspectIdentifier) dossier.suspectIdentifier = updateData.suspectIdentifier;
  if (updateData.financialLoss) dossier.financialLoss = updateData.financialLoss;
  if (updateData.retentionDays) dossier.retentionDays = updateData.retentionDays;

  await dossier.save();
  return dossier;
};

/**
 * Delete case dossier
 */
const deleteCase = async (caseId, userId) => {
  const dossier = await getCaseById(caseId, userId);
  await EvidenceCase.deleteOne({ _id: dossier._id });
  return { message: "Case dossier permanently deleted from vault" };
};

/**
 * Append timeline milestone
 */
const addTimelineEvent = async (caseId, userId, event) => {
  const dossier = await getCaseById(caseId, userId);
  if (!event.title) throw new Error("Milestone title is required");

  dossier.timeline.push({
    timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
    title: event.title.trim(),
    description: event.description || "",
    addedBy: event.addedBy || "Victim",
  });

  await dossier.save();
  return dossier.timeline;
};

/**
 * Append private case note
 */
const addCaseNote = async (caseId, userId, noteText) => {
  const dossier = await getCaseById(caseId, userId);
  if (!noteText || noteText.trim().length === 0) {
    throw new Error("Note content cannot be empty");
  }

  dossier.notes.push({
    content: noteText.trim(),
    createdAt: new Date(),
  });

  await dossier.save();
  return dossier.notes;
};

/**
 * Attach evidence file to case dossier
 */
const addEvidenceFile = async (caseId, userId, file) => {
  const dossier = await getCaseById(caseId, userId);
  const validated = validateFile(file);

  dossier.evidenceFiles.push(validated);
  dossier.timeline.push({
    timestamp: new Date(),
    title: "Evidence File Attached",
    description: `Added file '${validated.filename}' (${(validated.fileSize / 1024).toFixed(1)} KB)`,
    addedBy: "Victim",
  });

  await dossier.save();
  return dossier;
};

/**
 * Add transaction reference (UTR, TxID, bank ref)
 */
const addTransactionReference = async (caseId, userId, tx) => {
  const dossier = await getCaseById(caseId, userId);
  if (!tx.referenceId) throw new Error("Transaction reference ID is required");

  dossier.transactionReferences.push({
    referenceId: tx.referenceId.trim(),
    platform: tx.platform || "UPI",
    amount: Number(tx.amount) || 0,
    date: tx.date ? new Date(tx.date) : new Date(),
  });

  dossier.timeline.push({
    timestamp: new Date(),
    title: "Financial Transaction Logged",
    description: `Reference ${tx.referenceId} via ${tx.platform || "Payment Gateway"} (₹${tx.amount || 0})`,
    addedBy: "Victim",
  });

  await dossier.save();
  return dossier;
};

module.exports = {
  createCase,
  getUserCases,
  getCaseById,
  updateCase,
  deleteCase,
  addTimelineEvent,
  addCaseNote,
  addEvidenceFile,
  addTransactionReference,
};
