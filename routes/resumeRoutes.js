const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// GET /api/resumes - Получить все резюме
router.get('/', resumeController.getAllResumes);

module.exports = router;