const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.submitAnswers = async (req, res) => {
  const { answers } = req.body; // answers should be an array of objects: [{ questionId, value }]
  try {
    const questions = await Question.find();
    const scores = {
      Realistic: 0,
      Investigative: 0,
      Artistic: 0,
      Social: 0,
      Enterprising: 0,
      Conventional: 0
    };

    answers.forEach((answer) => {
      const question = questions.find((q) => q._id.toString() === answer.questionId);
      if (question) {
        scores[question.category] += answer.value;
      }
    });

    // Determine top 3 categories
    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    res.status(200).json({ scores, topCategories: sortedCategories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process answers' });
  }
};
