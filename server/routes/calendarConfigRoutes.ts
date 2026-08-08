import { Router } from 'express';
import { calendarConfig, setCalendarConfig } from '../db';

const router = Router();

router.get('/', (req, res) => {
  res.json(calendarConfig);
});

router.post('/', (req, res) => {
  setCalendarConfig(req.body);
  res.json({ success: true, config: calendarConfig });
});

export default router;
