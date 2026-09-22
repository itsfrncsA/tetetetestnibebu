const ExamResult = require('../models/ExamResult');
const Question = require('../models/Question');
const dbStore = require('../config/db');

// @desc    Submit exam, grade answers, and store examinee result
// @route   POST /api/exams/submit
exports.submitExam = async (req, res) => {
  try {
    const { 
      examineeName = 'Examinee', 
      mode = 'mock', 
      answers = {}, 
      timeSpentSeconds = 0 
    } = req.body;

    let allQuestions = [];
    if (dbStore.isMongo()) {
      allQuestions = await Question.find().lean();
    } else {
      allQuestions = dbStore.getMemoryQuestions();
    }

    const questionMap = new Map();
    allQuestions.forEach(q => questionMap.set(q.id, q));

    const submittedQuestionIds = Object.keys(answers).map(id => parseInt(id));
    const targetQuestions = submittedQuestionIds.length > 0 
      ? submittedQuestionIds.map(id => questionMap.get(id)).filter(Boolean)
      : allQuestions;

    let totalScore = 0;
    const subjectMap = {};
    const detailedAnswers = [];

    targetQuestions.forEach(q => {
      const selected = answers[q.id] || answers[q.id.toString()] || null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) totalScore++;

      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = { total: 0, correct: 0, percentage: 0 };
      }
      subjectMap[q.subject].total += 1;
      if (isCorrect) subjectMap[q.subject].correct += 1;

      detailedAnswers.push({
        questionId: q.id,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        choices: q.choices,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect,
        explanation: q.explanation,
        solution: q.solution,
        legalBasis: q.legalBasis
      });
    });

    let below65Count = 0;
    Object.keys(subjectMap).forEach(subj => {
      const s = subjectMap[subj];
      s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100 * 100) / 100 : 0;
      if (s.percentage < 65) {
        below65Count++;
      }
    });

    const totalQuestions = targetQuestions.length;
    const generalAverage = totalQuestions > 0 
      ? Math.round((totalScore / totalQuestions) * 100 * 100) / 100 
      : 0;

    let status = 'FAILED';
    if (generalAverage >= 75) {
      if (below65Count === 0) {
        status = 'PASSED';
      } else {
        status = 'CONDITIONAL';
      }
    } else {
      status = 'FAILED';
    }

    const examData = {
      examineeName: examineeName.trim() || 'Examinee',
      mode,
      totalQuestions,
      score: totalScore,
      generalAverage,
      status,
      subjectScores: subjectMap,
      timeSpentSeconds,
      answers: detailedAnswers
    };

    let savedResult;
    if (dbStore.isMongo()) {
      savedResult = await ExamResult.create(examData);
    } else {
      savedResult = dbStore.addMemoryResult(examData);
    }

    res.status(201).json({
      success: true,
      data: savedResult
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all exam submissions / history
// @route   GET /api/exams/history
exports.getExamHistory = async (req, res) => {
  try {
    const { name, limit = 100 } = req.query;

    let history = [];
    if (dbStore.isMongo()) {
      const query = {};
      if (name) {
        query.examineeName = { $regex: name, $options: 'i' };
      }
      history = await ExamResult.find(query)
        .select('-answers.choices -answers.explanation -answers.solution -answers.legalBasis')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();
    } else {
      history = dbStore.getMemoryResults();
      if (name) {
        history = history.filter(h => 
          h.examineeName.toLowerCase().includes(name.toLowerCase())
        );
      }
      history = history.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific exam submission by ID
// @route   GET /api/exams/:id
exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    let exam;

    if (dbStore.isMongo()) {
      exam = await ExamResult.findById(id).lean();
    } else {
      exam = dbStore.getMemoryResults().find(h => h._id === id || h.id === id);
    }

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam result not found' });
    }

    res.json({ success: true, data: exam });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an exam submission
// @route   DELETE /api/exams/:id
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbStore.isMongo()) {
      await ExamResult.findByIdAndDelete(id);
    } else {
      const results = dbStore.getMemoryResults();
      const index = results.findIndex(h => h._id === id || h.id === id);
      if (index !== -1) {
        results.splice(index, 1);
      }
    }

    res.json({ success: true, message: 'Exam result removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
