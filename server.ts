import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes';
import userRoutes from './server/routes/userRoutes';
import courseRoutes from './server/routes/courseRoutes';
import branchRoutes from './server/routes/branchRoutes';
import roomRoutes from './server/routes/roomRoutes';
import attendanceRoutes from './server/routes/attendanceRoutes';
import gradeRoutes from './server/routes/gradeRoutes';
import admissionRoutes from './server/routes/admissionRoutes';
import leaveRoutes from './server/routes/leaveRoutes';
import announcementRoutes from './server/routes/announcementRoutes';
import scheduleRoutes from './server/routes/scheduleRoutes';
import assessmentRoutes from './server/routes/assessmentRoutes';
import teacherTopicRoutes from './server/routes/teacherTopicRoutes';
import calendarConfigRoutes from './server/routes/calendarConfigRoutes';
import statsRoutes from './server/routes/statsRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/branches', branchRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/grades', gradeRoutes);
  app.use('/api/admissions', admissionRoutes);
  app.use('/api/leaves', leaveRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/schedule', scheduleRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/teacher/topics', teacherTopicRoutes);
  app.use('/api/calendar-config', calendarConfigRoutes);
  app.use('/api', attendanceRoutes);
  app.use('/api', statsRoutes);

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPulse School Management Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
