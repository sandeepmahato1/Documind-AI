const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/environment');
const loggerMiddleware = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Route Imports
const healthRoutes = require('./routes/healthRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const gapRoutes = require('./routes/gapRoutes');
const claimRoutes = require('./routes/claimRoutes');
const literatureRoutes = require('./routes/literatureRoutes');

const app = express();

// Connect MongoDB
mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(`🍃 Connected to MongoDB Database: ${config.mongoUri}`))
  .catch((err) => console.warn(`⚠️ MongoDB Warning: Could not connect to ${config.mongoUri}. Error: ${err.message}`));

// Middleware Pipeline
app.use(cors({
  origin: config.clientOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// API Route Mounts
app.use('/api', healthRoutes);
app.use('/api', workspaceRoutes);
app.use('/api', documentRoutes);
app.use('/api', chatRoutes);
app.use('/api', comparisonRoutes);
app.use('/api', gapRoutes);
app.use('/api', claimRoutes);
app.use('/api', literatureRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DocuMind AI Express API Gateway Running on Port ${PORT}`);
  console.log(`🌐 Allowed Client Origin: ${config.clientOrigin}`);
  console.log(`🐍 Configured Python AI Service: ${config.pythonBackendUrl}`);
  console.log(`🍃 MongoDB Storage: ${config.mongoUri}`);
  console.log(`=======================================================`);
});

module.exports = app;
