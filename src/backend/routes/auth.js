const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login ve POST /api/auth/logout rotaları
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;