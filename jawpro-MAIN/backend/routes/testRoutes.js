const express = require('express');
const router = express.Router();
const { getQuestions, submitAnswers } = require('../controllers/testController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/questions', authMiddleware, getQuestions);
router.post('/submit', authMiddleware, submitAnswers);

module.exports = router;
