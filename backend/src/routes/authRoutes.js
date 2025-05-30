const express = require('express');
const router = express.Router();
const { createNewAccessCode, validateAccessCode } = require('../controllers/authController');

// Create new access code
router.post('/create-access-code', createNewAccessCode);

// Validate access code
router.post('/validate-access-code', validateAccessCode);

module.exports = router; 