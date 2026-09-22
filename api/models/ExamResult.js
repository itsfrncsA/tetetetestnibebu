import mongoose from 'mongoose';

const answerDetailSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String },
  question: { type: String, required: true },
  choices: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  selectedAnswer: { type: String, default: null },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String },
  solution: { type: String, default: null },
  legalBasis: { type: String, default: null }
}, { _id: false });

const examResultSchema = new mongoose.Schema({
  examineeName: { type: String, required: true, trim: true, default: 'Examinee' },
  mode: { type: String, enum: ['mock', 'practice', 'drill'], default: 'mock' },
  totalQuestions: { type: Number, required: true },
  score: { type: Number, required: true },
  generalAverage: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PASSED', 'CONDITIONAL', 'FAILED'], 
    required: true 
  },
  subjectScores: {
    type: Map,
    of: new mongoose.Schema({
      total: Number,
      correct: Number,
      percentage: Number
    }, { _id: false })
  },
  timeSpentSeconds: { type: Number, default: 0 },
  answers: [answerDetailSchema]
}, {
  timestamps: true
});

const ExamResult = mongoose.models.ExamResult || mongoose.model('ExamResult', examResultSchema);
export default ExamResult;
