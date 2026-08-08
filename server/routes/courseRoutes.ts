import { Router } from 'express';
import { courses } from '../db';
import { Course } from '../../src/types';

const router = Router();

router.get('/', (req, res) => {
  res.json(courses);
});

router.post('/', (req, res) => {
  const courseData: Course = req.body;
  const existingIdx = courses.findIndex((c) => c.id === courseData.id);
  if (existingIdx >= 0) {
    courses[existingIdx] = { ...courses[existingIdx], ...courseData };
  } else {
    courseData.id = courseData.id || `course-${Date.now()}`;
    courses.push(courseData);
  }
  res.json({ success: true, course: courseData });
});

export default router;
