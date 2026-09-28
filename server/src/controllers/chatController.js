const { sendSuccess, sendError } = require('../middleware/errorHandler');
const pythonAiService = require('../services/pythonAiService');
const config = require('../config/environment');

const getChatThreads = async (req, res, next) => {
  try {
    const pythonData = await pythonAiService.getThreads();
    return sendSuccess(res, 200, pythonData.threads || [], 'Chat threads retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getThreadMessages = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const pythonData = await pythonAiService.getThreadMessages(threadId);
    return sendSuccess(res, 200, pythonData, 'Thread conversation retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const sendChatMessage = async (req, res, next) => {
  try {
    const { threadId, message } = req.body;
    const pythonData = await pythonAiService.sendChatMessage(threadId, message);
    return sendSuccess(res, 200, pythonData, 'Chat query executed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Server-Sent Events (SSE) Proxy for Live Response & Tool Streaming
 */
const streamChatMessage = async (req, res, next) => {
  try {
    const { threadId, message } = req.body || req.query;

    if (!threadId || !message) {
      return sendError(res, 400, 'Missing required parameters threadId and message');
    }

    // Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const pyResponse = await fetch(`${config.pythonBackendUrl}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, message })
    });

    if (!pyResponse.ok) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: `Python service error ${pyResponse.status}` })}\n\n`);
      return res.end();
    }

    const reader = pyResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunkStr = decoder.decode(value, { stream: true });
      res.write(chunkStr);
    }

    res.end();
  } catch (err) {
    console.error('[SSE Error]', err);
    if (!res.headersSent) {
      return next(err);
    }
    res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
    res.end();
  }
};

module.exports = {
  getChatThreads,
  getThreadMessages,
  sendChatMessage,
  streamChatMessage
};
