const express = require('express');
const router = express.Router();
const { 
  getQuestions, 
  getQuestionById, 
  getSubjectSummary 
} = require('../controllers/questionController');

router.get('/', getQuestions);
router.get('/summary', getSubjectSummary);
router.get('/summary/overview', getSubjectSummary);
router.get('/:id', getQuestionById);

module.exports = router;
