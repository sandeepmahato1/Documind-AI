const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: false
  },
  threadId: {
    type: String,
    required: true,
    index: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileHash: {
    type: String,
    index: true
  },
  uploadTimestamp: {
    type: Date,
    default: Date.now
  },
  processingStatus: {
    type: String,
    enum: ['Indexed', 'Processing', 'Failed'],
    default: 'Processing'
  },
  pageCount: {
    type: Number,
    default: 0
  },
  chunksCount: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Document', documentSchema);
