const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { saveResult, getUserResults } = require('../controllers/riasecController');

router.post('/save', auth, saveResult);
router.get('/user', auth, getUserResults);

module.exports = router;
