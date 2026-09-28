const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

router.get('/comparison', comparisonController.getPaperComparison);

module.exports = router;
