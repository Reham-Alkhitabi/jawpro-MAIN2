require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/riasec', require('./routes/riasecRoutes'));
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/ai', require('./routes/aiRoutes')); // ✅ added AI route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
