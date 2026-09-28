const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { validateRequiredFields } = require('../middleware/validateRequest');

router.get('/workspaces', workspaceController.getWorkspaces);
router.post('/workspaces', validateRequiredFields(['name']), workspaceController.createWorkspace);
router.put('/workspaces/:id', workspaceController.updateWorkspace);

module.exports = router;
