const { sendSuccess } = require('../middleware/errorHandler');
const pythonAiService = require('../services/pythonAiService');

const getHealthStatus = async (req, res, next) => {
  try {
    const pythonStatus = await pythonAiService.checkPythonBackendHealth();

    const healthData = {
      service: 'DocuMind AI Node.js Express API Gateway',
      status: 'UP',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      pythonBackend: {
        targetUrl: pythonAiService.baseUrl,
        status: pythonStatus
      }
    };

    return sendSuccess(res, 200, healthData, 'System health status retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHealthStatus
};
