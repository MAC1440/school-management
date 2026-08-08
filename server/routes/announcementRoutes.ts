import { Router } from 'express';
import { announcements } from '../db';
import { Announcement } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  res.json(announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
});

router.post('/', (req, res) => {
  const ann: Announcement = req.body;
  ann.id = ann.id || `ann-${Date.now()}`;
  ann.date = ann.date || new Date().toISOString().split('T')[0];
  announcements.unshift(ann);
  res.json({ success: true, announcement: ann });
});

export default router;
