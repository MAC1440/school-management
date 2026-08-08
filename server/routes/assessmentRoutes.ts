import { Router } from 'express';
import { assessments } from '../db';
import { AssessmentItem } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { courseId } = req.query;
  if (courseId) {
    return res.json(assessments.filter((a) => a.courseId === courseId));
  }
  res.json(assessments);
});

router.post('/', (req, res) => {
  const item: AssessmentItem = req.body;
  item.id = item.id || `asm-${Date.now()}`;
  assessments.push(item);
  res.json({ success: true, assessment: item });
});

export default router;
