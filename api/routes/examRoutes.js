import express from 'express';
import { 
  submitExam, 
  getExamHistory, 
  getExamById, 
  deleteExam 
} from '../controllers/examController.js';

const router = express.Router();

router.post('/submit', submitExam);
router.get('/history', getExamHistory);
router.get('/:id', getExamById);
router.delete('/:id', deleteExam);

export default router;
