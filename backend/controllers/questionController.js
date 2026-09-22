const Question = require('../models/Question');
const dbStore = require('../config/db');

// @desc    Get all questions with optional filters (subject, difficulty, limit, shuffle)
// @route   GET /api/questions
exports.getQuestions = async (req, res) => {
  try {
    const { subject, difficulty, limit, shuffle } = req.query;

    let questions = [];

    if (dbStore.isMongo()) {
      const filter = {};
      if (subject) filter.subject = subject;
      if (difficulty) filter.difficulty = difficulty;
      questions = await Question.find(filter).lean();
    } else {
      questions = [...dbStore.getMemoryQuestions()];
      if (subject) {
        questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
      }
      if (difficulty) {
        questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
    }

    if (shuffle === 'true' || shuffle === true) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    if (limit && !isNaN(parseInt(limit))) {
      questions = questions.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
exports.getQuestionById = async (req, res) => {
  try {
    const qId = parseInt(req.params.id);
    let question;

    if (dbStore.isMongo()) {
      question = await Question.findOne({ id: qId });
    } else {
      question = dbStore.getMemoryQuestions().find(q => q.id === qId);
    }

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subject overview and counts
// @route   GET /api/subjects/summary
exports.getSubjectSummary = async (req, res) => {
  try {
    let questions = [];
    if (dbStore.isMongo()) {
      questions = await Question.find().lean();
    } else {
      questions = dbStore.getMemoryQuestions();
    }

    const subjects = [
      { code: 'FAR', name: 'Financial Accounting and Reporting' },
      { code: 'AFAR', name: 'Advanced Financial Accounting and Reporting' },
      { code: 'MAS', name: 'Management Advisory Services' },
      { code: 'AUD', name: 'Auditing' },
      { code: 'TAX', name: 'Taxation' },
      { code: 'RFBT', name: 'Regulatory Framework for Business Transactions' }
    ];

    const summary = subjects.map(s => {
      const list = questions.filter(q => q.subject === s.code);
      return {
        code: s.code,
        name: s.name,
        total: list.length,
        easyCount: list.filter(q => q.difficulty === 'Easy').length,
        moderateCount: list.filter(q => q.difficulty === 'Moderate').length,
        difficultCount: list.filter(q => q.difficulty === 'Difficult').length,
        topics: [...new Set(list.map(q => q.topic))]
      };
    });

    res.json({
      success: true,
      totalQuestions: questions.length,
      subjects: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
