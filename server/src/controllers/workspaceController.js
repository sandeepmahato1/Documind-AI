const Workspace = require('../models/Workspace');
const { sendSuccess, sendError } = require('../middleware/errorHandler');

const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find().sort({ updatedAt: -1 });
    return sendSuccess(res, 200, workspaces, 'Workspaces retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const createWorkspace = async (req, res, next) => {
  try {
    const { name, description, tags } = req.body;
    const workspace = new Workspace({
      name,
      description: description || '',
      tags: tags || ['Research']
    });

    await workspace.save();
    return sendSuccess(res, 201, workspace, 'Workspace created successfully');
  } catch (err) {
    next(err);
  }
};

const updateWorkspace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const workspace = await Workspace.findByIdAndUpdate(
      id,
      { name, description, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!workspace) {
      return sendError(res, 404, 'Workspace not found');
    }

    return sendSuccess(res, 200, workspace, 'Workspace updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  updateWorkspace
};
