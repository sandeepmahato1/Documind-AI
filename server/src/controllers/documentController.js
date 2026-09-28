const crypto = require('crypto');
const Document = require('../models/Document');
const { sendSuccess, sendError } = require('../middleware/errorHandler');
const pythonAiService = require('../services/pythonAiService');
const config = require('../config/environment');

const getDocuments = async (req, res, next) => {
  try {
    const { threadId, workspaceId } = req.query;
    const filter = {};
    if (threadId) filter.threadId = threadId;
    if (workspaceId) filter.workspaceId = workspaceId;

    const documents = await Document.find(filter).sort({ uploadTimestamp: -1 });
    return sendSuccess(res, 200, documents, 'Documents retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const file = req.file;
    const threadId = req.body.threadId || req.body.thread_id;
    const workspaceId = req.body.workspaceId;

    if (!file) {
      return sendError(res, 400, 'No file uploaded');
    }
    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return sendError(res, 400, 'Invalid file type. Only PDF documents are supported.');
    }
    if (!threadId) {
      return sendError(res, 400, 'Missing required parameter threadId');
    }

    // Deduplication check using MD5 File Hash
    const fileHash = crypto.createHash('md5').update(file.buffer).digest('hex');
    const existingDoc = await Document.findOne({ threadId, fileHash });

    if (existingDoc && existingDoc.processingStatus === 'Indexed') {
      return sendSuccess(res, 200, existingDoc, 'Document already indexed (Deduplicated)');
    }

    // Forward to Python FAISS Vector Ingestion Pipeline
    const pythonResult = await pythonAiService.ingestDocument(
      threadId,
      file.originalname,
      file.buffer
    );

    const summary = pythonResult.summary || {};

    // Save metadata record in MongoDB
    const docRecord = new Document({
      workspaceId: workspaceId || null,
      threadId,
      originalFilename: file.originalname,
      fileSize: file.size,
      fileHash,
      processingStatus: 'Indexed',
      pageCount: summary.documents || 0,
      chunksCount: summary.chunks || 0
    });

    await docRecord.save();

    return sendSuccess(res, 200, docRecord, 'PDF document uploaded and indexed into FAISS vector store');
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return sendError(res, 404, 'Document record not found');
    }

    // Call Python service to clear thread FAISS index
    try {
      await fetch(`${config.pythonBackendUrl}/api/documents/${doc.threadId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[Vector Index Deletion Warning]', err.message);
    }

    await Document.findByIdAndDelete(id);

    return sendSuccess(res, 200, { id }, 'Document deleted and vector index cleared');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDocuments,
  uploadDocument,
  deleteDocument
};
