const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  subject: { 
    type: String, 
    required: true, 
    enum: ['FAR', 'AFAR', 'MAS', 'AUD', 'TAX', 'RFBT'] 
  },
  topic: { type: String, required: true },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['Easy', 'Moderate', 'Difficult'] 
  },
  question: { type: String, required: true },
  choices: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
  explanation: { type: String, required: true },
  solution: { type: String, default: null },
  legalBasis: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);
