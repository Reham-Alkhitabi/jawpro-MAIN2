const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware');
const axios = require('axios');

router.post('/recommend', authMiddleware, async (req, res) => {
  try {
    let { scores } = req.body;

    if (!scores) return res.status(400).json({ error: 'Missing RIASEC scores.' });

    const numericArray = Array.isArray(scores)
      ? scores.map(Number)
      : ['R', 'I', 'A', 'S', 'E', 'C'].map(k => Number(scores[k]));

    if (numericArray.some(val => typeof val !== 'number' || isNaN(val))) {
      return res.status(400).json({ error: 'Scores must be numeric values.' });
    }

const flaskRes = await axios.post('http://ai:5001/predict', {
  scores: numericArray,
});

    const { recommendations } = flaskRes.data;

    if (!recommendations || !Array.isArray(recommendations)) {
      return res.status(500).json({ error: 'AI model did not return valid recommendations.' });
    }

    return res.status(200).json({ recommendations });
  } catch (err) {
    console.error('❌ AI Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch AI recommendations' });
  }
});

module.exports = router;
