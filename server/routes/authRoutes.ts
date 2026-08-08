import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users, staffAttendance } from '../db';
import { User, StaffAttendanceRecord } from '../../src/types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'edupulse-super-secret-jwt-key';

// Login
router.post('/login', (req, res) => {
  const { email, role, userId } = req.body;
  let targetUser: User | undefined;

  if (userId) {
    targetUser = users.find((u) => u.id === userId);
  } else if (email) {
    targetUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  } else if (role) {
    targetUser = users.find((u) => u.role === role);
  }

  if (!targetUser) {
    return res.status(401).json({ error: 'Invalid authentication credentials or user not found.' });
  }

  const token = jwt.sign(
    {
      id: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      name: targetUser.name,
      branchId: targetUser.branchId,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: targetUser });
});

// Verify token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const currentUser = users.find((u) => u.id === decoded.id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json({ user: currentUser });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

// Kiosk PIN Verification
router.post('/kiosk-verify-pin', (req, res) => {
  const { staffId, pin, branchId } = req.body;
  if (!staffId || !pin) {
    return res.status(400).json({ error: 'Staff ID and PIN are required.' });
  }

  const staffMember = users.find((u) => u.id === staffId);
  if (!staffMember) {
    return res.status(404).json({ error: 'Staff member not found.' });
  }

  const validPin = staffMember.pin || '1234';
  if (pin.toString().trim() !== validPin.toString().trim()) {
    return res.status(401).json({ error: 'Incorrect 4-digit PIN code. Please try again.' });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const checkInTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const existingIdx = staffAttendance.findIndex((sa) => sa.staffId === staffId && sa.date === todayStr);
  let record: StaffAttendanceRecord;

  if (existingIdx >= 0) {
    staffAttendance[existingIdx].status = 'present';
    staffAttendance[existingIdx].checkInTime = checkInTimeStr;
    record = staffAttendance[existingIdx];
  } else {
    record = {
      id: `satt-${Date.now()}`,
      staffId: staffMember.id,
      staffName: staffMember.name,
      staffRole: staffMember.role,
      branchId: branchId || staffMember.branchId || 'br-1',
      branchName: staffMember.branchName || 'Main Campus',
      date: todayStr,
      checkInTime: checkInTimeStr,
      status: 'present',
    };
    staffAttendance.unshift(record);
  }

  res.json({
    success: true,
    message: `Attendance marked successfully for ${staffMember.name}`,
    staffName: staffMember.name,
    checkInTime: checkInTimeStr,
    record,
  });
});

export default router;
