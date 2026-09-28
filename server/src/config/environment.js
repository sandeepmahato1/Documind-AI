require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  pythonBackendUrl: process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/documind'
};

module.exports = config;
