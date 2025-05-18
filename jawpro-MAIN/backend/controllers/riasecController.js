const RiasecResult = require('../models/RiasecResult');

exports.saveResult = async (req, res) => {
  try {
    const { scores, answers, recommendation } = req.body;

    const newResult = new RiasecResult({
      userId: req.userId,
      scores,
      answers,
      recommendation
    });

    await newResult.save();
    res.status(201).json({ message: 'RIASEC result saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await RiasecResult.find({ userId: req.userId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
