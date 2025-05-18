const mongoose = require('mongoose');

const riasecResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: Array, required: true },
  scores: {
    R: Number,
    I: Number,
    A: Number,
    S: Number,
    E: Number,
    C: Number,
  },
  recommendation: {
    major: String,
    occupation: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RiasecResult', riasecResultSchema);
