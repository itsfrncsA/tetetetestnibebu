import Question from '../models/Question.js';
import * as dbStore from '../config/db.js';

// Helper for balanced mock sampling across all 6 CPALE subjects
const sampleBalancedMock = (allQuestions) => {
  const quotas = { FAR: 10, AFAR: 10, MAS: 8, AUD: 8, TAX: 7, RFBT: 7 };
  let selected = [];

  Object.keys(quotas).forEach(subj => {
    const pool = allQuestions.filter(q => q.subject === subj).sort(() => Math.random() - 0.5);
    selected.push(...pool.slice(0, quotas[subj]));
  });

  return selected.sort(() => Math.random() - 0.5);
};

// @desc    Get all questions with optional filters
// @route   GET /api/questions
export const getQuestions = async (req, res) => {
  try {
    const { subject, topic, difficulty, limit, shuffle, mode } = req.query;
    let questions = [];

    if (dbStore.isMongo()) {
      const filter = {};
      if (subject && subject !== 'ALL') filter.subject = subject;
      if (topic && topic !== 'ALL') filter.topic = topic;
      if (difficulty && difficulty !== 'ALL') filter.difficulty = difficulty;
      questions = await Question.find(filter).lean();
    } else {
      questions = [...dbStore.getMemoryQuestions()];
      if (subject && subject !== 'ALL') {
        questions = questions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
      }
      if (topic && topic !== 'ALL') {
        questions = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
      }
      if (difficulty && difficulty !== 'ALL') {
        questions = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
    }

    // If taking a full 50-item Mock Board Exam across all subjects, do balanced randomized sampling
    if ((!subject || subject === 'ALL') && (mode === 'mock' || parseInt(limit) === 50)) {
      questions = sampleBalancedMock(questions);
    } else {
      if (shuffle === 'true' || shuffle === true) {
        questions = questions.sort(() => Math.random() - 0.5);
      }
      if (limit && !isNaN(parseInt(limit))) {
        questions = questions.slice(0, parseInt(limit));
      }
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
export const getQuestionById = async (req, res) => {
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
// @route   GET /api/questions/summary
export const getSubjectSummary = async (req, res) => {
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
