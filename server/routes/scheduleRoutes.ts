import { Router } from 'express';
import { schedule } from '../db';
import { ScheduleItem } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  res.json(schedule);
});

router.post('/', (req, res) => {
  const item: ScheduleItem = req.body;
  const idx = schedule.findIndex((s) => s.id === item.id);
  if (idx >= 0) {
    schedule[idx] = item;
  } else {
    item.id = `sch-${Date.now()}`;
    schedule.push(item);
  }
  res.json({ success: true, item });
});

export default router;
