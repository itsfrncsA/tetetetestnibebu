// API Service for CPALE Reviewer with built-in instant data bundle
import { cpaleQuestions } from '../data/questionsData.js';

const API_BASE = '/api';

export const apiService = {
  // Fetch questions (attempts API first, falls back instantly to bundled questions)
  async getQuestions(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/questions${query ? `?${query}` : ''}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && json.data.length > 0) {
          return json;
        }
      }
    } catch (err) {
      console.warn('API fetch attempt failed, using bundled questions:', err.message);
    }

    // Client-side fallback filter
    let list = [...cpaleQuestions];
    if (params.subject && params.subject !== 'ALL') {
      list = list.filter(q => q.subject.toLowerCase() === params.subject.toLowerCase());
    }
    if (params.topic && params.topic !== 'ALL') {
      list = list.filter(q => q.topic.toLowerCase() === params.topic.toLowerCase());
    }
    if (params.difficulty && params.difficulty !== 'ALL') {
      list = list.filter(q => q.difficulty.toLowerCase() === params.difficulty.toLowerCase());
    }
    if (params.shuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    if (params.limit && !isNaN(parseInt(params.limit))) {
      list = list.slice(0, parseInt(params.limit));
    }
    return { success: true, count: list.length, data: list };
  },

  // Fetch subject overview
  async getSubjectSummary() {
    try {
      const res = await fetch(`${API_BASE}/questions/summary`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.subjects && data.subjects.length > 0) return data;
      }
    } catch (err) {
      console.warn('Subject summary API error, computing from bundle:', err.message);
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
      const list = cpaleQuestions.filter(q => q.subject === s.code);
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

    return {
      success: true,
      totalQuestions: cpaleQuestions.length,
      subjects: summary
    };
  },

  // Submit exam and evaluate score
  async submitExam(payload) {
    try {
      const res = await fetch(`${API_BASE}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Submit API error, saving to local storage:', err.message);
    }

    // Client-side evaluation fallback
    const { examineeName = 'Examinee', mode = 'mock', answers = {}, timeSpentSeconds = 0 } = payload;
    let totalScore = 0;
    const subjectMap = {};
    const detailedAnswers = [];

    cpaleQuestions.forEach(q => {
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
      if (s.percentage < 65) below65Count++;
    });

    const totalQuestions = cpaleQuestions.length;
    const generalAverage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100 * 100) / 100 : 0;
    let status = 'FAILED';
    if (generalAverage >= 75) {
      status = below65Count === 0 ? 'PASSED' : 'CONDITIONAL';
    }

    const localResult = {
      _id: 'local_' + Date.now(),
      examineeName,
      mode,
      totalQuestions,
      score: totalScore,
      generalAverage,
      status,
      subjectScores: subjectMap,
      timeSpentSeconds,
      answers: detailedAnswers,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cpale_local_history') || '[]');
      existing.unshift(localResult);
      localStorage.setItem('cpale_local_history', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    return { success: true, data: localResult };
  },

  // Get exam submissions / examinee test history
  async getExamHistory(name = '', currentUser = null, defaultExamineeName = '') {
    const isSuperadmin = currentUser && (currentUser.role === 'superadmin' || currentUser.username === 'superadmin');
    
    // For normal users, lock search query to their own name
    let queryName = name;
    if (!isSuperadmin) {
      if (currentUser?.name) {
        queryName = currentUser.name;
      } else if (defaultExamineeName) {
        queryName = defaultExamineeName;
      }
    }

    try {
      const query = queryName ? `?name=${encodeURIComponent(queryName)}` : '';
      const res = await fetch(`${API_BASE}/exams/history${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          let list = data.data;
          if (!isSuperadmin && currentUser?.name) {
            list = list.filter(h => h.examineeName?.toLowerCase() === currentUser.name.toLowerCase());
          }
          return { success: true, count: list.length, data: list };
        }
      }
    } catch (err) {
      console.warn('History API error, reading from local history:', err.message);
    }

    try {
      let history = JSON.parse(localStorage.getItem('cpale_local_history') || '[]');
      if (!isSuperadmin) {
        if (currentUser?.name) {
          history = history.filter(h => h.examineeName?.toLowerCase() === currentUser.name.toLowerCase());
        } else if (defaultExamineeName) {
          history = history.filter(h => h.examineeName?.toLowerCase() === defaultExamineeName.toLowerCase());
        } else if (name) {
          history = history.filter(h => h.examineeName?.toLowerCase().includes(name.toLowerCase()));
        }
      } else if (name) {
        history = history.filter(h => h.examineeName?.toLowerCase().includes(name.toLowerCase()));
      }
      return { success: true, count: history.length, data: history };
    } catch (e) {
      return { success: true, count: 0, data: [] };
    }
  },

  // Get full details of a specific exam attempt
  async getExamById(id) {
    try {
      const res = await fetch(`${API_BASE}/exams/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('GetExamById API error:', err.message);
    }

    try {
      const history = JSON.parse(localStorage.getItem('cpale_local_history') || '[]');
      const item = history.find(h => h._id === id || h.id === id);
      if (item) return { success: true, data: item };
    } catch (e) {}

    throw new Error('Exam result not found');
  },

  // Delete an exam record
  async deleteExam(id) {
    try {
      const res = await fetch(`${API_BASE}/exams/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    try {
      let history = JSON.parse(localStorage.getItem('cpale_local_history') || '[]');
      history = history.filter(h => h._id !== id && h.id !== id);
      localStorage.setItem('cpale_local_history', JSON.stringify(history));
      return { success: true, message: 'Deleted' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
};
