import express from 'express';
import { 
  getQuestions, 
  getQuestionById, 
  getSubjectSummary 
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/summary', getSubjectSummary);
router.get('/summary/overview', getSubjectSummary);
router.get('/:id', getQuestionById);

export default router;
