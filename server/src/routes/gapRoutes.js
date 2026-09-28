const express = require('express');
const router = express.Router();
const gapController = require('../controllers/gapController');

router.get('/gaps', gapController.getResearchGaps);

module.exports = router;
