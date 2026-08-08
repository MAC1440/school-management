import { Router } from 'express';
import { users, courses, attendance, grades, branches, admissions, resetDb } from '../db';
import { SchoolStats } from '../../src/types';

const router = Router();

router.get('/stats', (req, res) => {
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const totalCourses = courses.length;

  const presentCount = attendance.filter((a) => a.status === 'present' || a.status === 'tardy').length;
  const overallAttendanceRate =
    attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 95;

  let totalScoresPercentage = 0;
  if (grades.length > 0) {
    const sum = grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0);
    totalScoresPercentage = sum / grades.length;
  } else {
    totalScoresPercentage = 88;
  }
  const averageGpa = parseFloat(((totalScoresPercentage / 100) * 4.0).toFixed(2));

  const pendingAdmissionsCount = admissions.filter((a) => a.status === 'pending').length;

  const stats: SchoolStats = {
    totalStudents,
    totalTeachers,
    totalCourses,
    overallAttendanceRate,
    averageGpa,
    atRiskStudentsCount: 2,
    totalBranches: branches.length,
    pendingAdmissionsCount,
  };

  res.json(stats);
});

router.post('/reset-data', (req, res) => {
  resetDb();
  res.json({ success: true, message: 'School database successfully reset to default state.' });
});

export default router;
