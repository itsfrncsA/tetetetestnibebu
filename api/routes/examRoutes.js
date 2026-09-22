const express = require('express');
const router = express.Router();
const { 
  submitExam, 
  getExamHistory, 
  getExamById, 
  deleteExam 
} = require('../controllers/examController');

router.post('/submit', submitExam);
router.get('/history', getExamHistory);
router.get('/:id', getExamById);
router.delete('/:id', deleteExam);

module.exports = router;
