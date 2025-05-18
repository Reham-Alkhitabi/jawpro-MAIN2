const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

// AI Recommendation
app.post('/api/ai/recommend', async (req, res) => {
  try {
    let { scores } = req.body;

    if (!scores || (!Array.isArray(scores) && typeof scores !== 'object')) {
      return res.status(400).json({ error: 'Missing or invalid RIASEC scores.' });
    }

    const ordered = Array.isArray(scores)
      ? scores.map(Number)
      : ['R', 'I', 'A', 'S', 'E', 'C'].map(k => Number(scores[k]));

    if (ordered.length !== 6 || ordered.some(v => typeof v !== 'number' || isNaN(v))) {
      return res.status(400).json({ error: 'Scores must be numeric values.' });
    }

    const flaskRes = await axios.post('http://localhost:5001/predict', {
      scores: ordered
    });

    const { recommendations } = flaskRes.data;

    if (!Array.isArray(recommendations)) {
      return res.status(500).json({ error: 'Invalid AI response format.' });
    }

    res.status(200).json({ recommendations });
  } catch (err) {
    console.error('🔥 AI Recommendation Error:', err.message);
    res.status(500).json({ error: 'Failed to get AI recommendations' });
  }
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
