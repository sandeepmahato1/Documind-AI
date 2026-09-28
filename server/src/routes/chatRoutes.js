const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateRequiredFields } = require('../middleware/validateRequest');

router.get('/chat/threads', chatController.getChatThreads);
router.get('/chat/threads/:threadId/messages', chatController.getThreadMessages);
router.post('/chat/message', validateRequiredFields(['threadId', 'message']), chatController.sendChatMessage);
router.post('/chat/stream', chatController.streamChatMessage);

module.exports = router;
