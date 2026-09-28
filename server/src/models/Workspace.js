const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: ['Research']
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

workspaceSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Workspace', workspaceSchema);
