import { Router } from 'express';
import { attendance, staffAttendance } from '../db';
import { AttendanceRecord, StaffAttendanceRecord } from '../../src/types';

const router = Router();

// Student Attendance GET
router.get('/attendance', (req, res) => {
  const { studentId, courseId, date } = req.query;
  let filtered = [...attendance];
  if (studentId) filtered = filtered.filter((a) => a.studentId === studentId);
  if (courseId) filtered = filtered.filter((a) => a.courseId === courseId);
  if (date) filtered = filtered.filter((a) => a.date === date);
  res.json(filtered);
});

// Student Attendance Batch POST
router.post('/attendance/batch', (req, res) => {
  const records: AttendanceRecord[] = req.body.records;
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'records must be an array' });
  }

  for (const record of records) {
    const existingIdx = attendance.findIndex(
      (a) =>
        a.studentId === record.studentId &&
        a.courseId === record.courseId &&
        a.date === record.date
    );
    if (existingIdx >= 0) {
      attendance[existingIdx] = { ...attendance[existingIdx], ...record };
    } else {
      record.id = record.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      attendance.push(record);
    }
  }

  res.json({ success: true, count: records.length });
});

// Staff Attendance GET
router.get('/staff-attendance', (req, res) => {
  const { branchId, date, staffId } = req.query;
  let list = [...staffAttendance];
  if (branchId) list = list.filter((sa) => sa.branchId === branchId);
  if (date) list = list.filter((sa) => sa.date === date);
  if (staffId) list = list.filter((sa) => sa.staffId === staffId);
  res.json(list);
});

// Staff Attendance POST
router.post('/staff-attendance', (req, res) => {
  const record: StaffAttendanceRecord = req.body;
  record.id = record.id || `satt-${Date.now()}`;
  const idx = staffAttendance.findIndex((sa) => sa.id === record.id);
  if (idx >= 0) {
    staffAttendance[idx] = record;
  } else {
    staffAttendance.unshift(record);
  }
  res.json({ success: true, record });
});

export default router;
