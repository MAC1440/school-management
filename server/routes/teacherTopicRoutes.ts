import { Router } from 'express';
import { topicPlans } from '../db';
import { TeacherTopicPlan } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { teacherId, courseId } = req.query;
  let list = [...topicPlans];
  if (teacherId) list = list.filter((t) => t.teacherId === teacherId);
  if (courseId) list = list.filter((t) => t.courseId === courseId);
  res.json(list);
});

router.post('/', (req, res) => {
  const plan: TeacherTopicPlan = req.body;
  plan.id = plan.id || `tp-${Date.now()}`;
  const idx = topicPlans.findIndex((t) => t.id === plan.id);
  if (idx >= 0) {
    topicPlans[idx] = plan;
  } else {
    topicPlans.push(plan);
  }
  res.json({ success: true, topic: plan });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const idx = topicPlans.findIndex((t) => t.id === id);
  if (idx >= 0) {
    topicPlans[idx] = { ...topicPlans[idx], ...req.body };
    return res.json({ success: true, topic: topicPlans[idx] });
  }
  res.status(404).json({ error: 'Topic plan not found' });
});

export default router;
