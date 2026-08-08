import { Router } from 'express';
import { grades, setGrades } from '../db';
import { GradeRecord } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  const { studentId, courseId } = req.query;
  let filtered = [...grades];
  if (studentId) filtered = filtered.filter((g) => g.studentId === studentId);
  if (courseId) filtered = filtered.filter((g) => g.courseId === courseId);
  res.json(filtered);
});

router.post('/', (req, res) => {
  const grade: GradeRecord = req.body;
  const idx = grades.findIndex((g) => g.id === grade.id);
  if (idx >= 0) {
    grades[idx] = grade;
  } else {
    grade.id = grade.id || `grd-${Date.now()}`;
    grades.push(grade);
  }
  res.json({ success: true, grade });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  setGrades(grades.filter((g) => g.id !== id));
  res.json({ success: true });
});

export default router;
