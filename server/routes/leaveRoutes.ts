import { Router } from 'express';
import { leaveApplications } from '../db';
import { LeaveApplication } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { applicantId } = req.query;
  if (applicantId) {
    return res.json(leaveApplications.filter((l) => l.applicantId === applicantId));
  }
  res.json(leaveApplications);
});

router.post('/', (req, res) => {
  const leave: LeaveApplication = req.body;
  leave.id = `lv-${Date.now()}`;
  leave.status = 'pending';
  leave.createdAt = new Date().toISOString().split('T')[0];
  leaveApplications.unshift(leave);
  res.json({ success: true, leave });
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const idx = leaveApplications.findIndex((l) => l.id === id);
  if (idx >= 0) {
    leaveApplications[idx].status = status;
    return res.json({ success: true, leave: leaveApplications[idx] });
  }
  res.status(404).json({ error: 'Leave application not found' });
});

export default router;
