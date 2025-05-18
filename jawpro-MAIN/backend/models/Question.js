const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
    required: true
  }
});

module.exports = mongoose.model('Question', questionSchema);
