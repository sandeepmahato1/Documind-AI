const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.get('/claims', claimController.verifyClaims);

module.exports = router;
