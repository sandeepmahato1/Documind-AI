const express = require('express');
const router = express.Router();
const literatureController = require('../controllers/literatureController');

router.get('/literature-review', literatureController.generateLiteratureReview);

module.exports = router;
