const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contacts - Создать новое обращение
router.post('/', contactController.sendMeMessage);

module.exports = router;