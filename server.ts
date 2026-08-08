import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_SCHEDULE,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_BRANCHES,
  INITIAL_ROOMS,
  INITIAL_CALENDAR_CONFIG,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_ADMISSIONS,
  INITIAL_TOPIC_PLANS,
  INITIAL_LEAVES,
  INITIAL_ASSESSMENTS,
} from './src/mockData';
import {
  User,
  Course,
  ScheduleItem,
  AttendanceRecord,
  StaffAttendanceRecord,
  GradeRecord,
  Announcement,
  SchoolStats,
  Branch,
  Room,
  SchoolCalendarConfig,
  AdmissionApplication,
  TeacherTopicPlan,
  LeaveApplication,
  AssessmentItem,
} from './src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'edupulse-super-secret-jwt-key';

// In-Memory Database Store (Shared State)
let users: User[] = [...INITIAL_USERS];
let courses: Course[] = [...INITIAL_COURSES];
let schedule: ScheduleItem[] = [...INITIAL_SCHEDULE];
let attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
let grades: GradeRecord[] = [...INITIAL_GRADES];
let announcements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let branches: Branch[] = [...INITIAL_BRANCHES];
let rooms: Room[] = [...INITIAL_ROOMS];
let calendarConfig: SchoolCalendarConfig = { ...INITIAL_CALENDAR_CONFIG };
let staffAttendance: StaffAttendanceRecord[] = [...INITIAL_STAFF_ATTENDANCE];
let admissions: AdmissionApplication[] = [...INITIAL_ADMISSIONS];
let topicPlans: TeacherTopicPlan[] = [...INITIAL_TOPIC_PLANS];
let leaveApplications: LeaveApplication[] = [...INITIAL_LEAVES];
let assessments: AssessmentItem[] = [...INITIAL_ASSESSMENTS];

// Gemini AI Helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- AUTHENTICATION & JWT ENDPOINTS ---

  // Login (by Email or Role Switcher)
  app.post('/api/auth/login', (req, res) => {
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

  // Verify JWT token & fetch current user profile
  app.get('/api/auth/me', (req, res) => {
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

  // Kiosk PIN Verification & Attendance Marking
  app.post('/api/auth/kiosk-verify-pin', (req, res) => {
    const { staffId, pin, branchId } = req.body;
    if (!staffId || !pin) {
      return res.status(400).json({ error: 'Staff ID and PIN are required.' });
    }

    const staffMember = users.find((u) => u.id === staffId);
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    // Verify PIN (default to '1234' if none explicitly set)
    const validPin = staffMember.pin || '1234';
    if (pin.toString().trim() !== validPin.toString().trim()) {
      return res.status(401).json({ error: 'Incorrect 4-digit PIN code. Please try again.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const checkInTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Check if attendance already marked today
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

  // --- BRANCHES & ROOMS ---

  app.get('/api/branches', (req, res) => {
    res.json(branches);
  });

  app.post('/api/branches', (req, res) => {
    const newBranch: Branch = req.body;
    newBranch.id = newBranch.id || `br-${Date.now()}`;
    const idx = branches.findIndex((b) => b.id === newBranch.id);
    if (idx >= 0) {
      branches[idx] = newBranch;
    } else {
      branches.push(newBranch);
    }
    res.json({ success: true, branch: newBranch });
  });

  app.delete('/api/branches/:id', (req, res) => {
    const { id } = req.params;
    branches = branches.filter((b) => b.id !== id);
    res.json({ success: true });
  });

  app.get('/api/rooms', (req, res) => {
    const { branchId } = req.query;
    if (branchId) {
      return res.json(rooms.filter((r) => r.branchId === branchId));
    }
    res.json(rooms);
  });

  app.post('/api/rooms', (req, res) => {
    const room: Room = req.body;
    room.id = room.id || `rm-${Date.now()}`;
    const idx = rooms.findIndex((r) => r.id === room.id);
    if (idx >= 0) {
      rooms[idx] = room;
    } else {
      rooms.push(room);
    }
    res.json({ success: true, room });
  });

  app.delete('/api/rooms/:id', (req, res) => {
    rooms = rooms.filter((r) => r.id !== req.params.id);
    res.json({ success: true });
  });

  // --- USERS & STAFF MANAGEMENT ---

  app.get('/api/users', (req, res) => {
    const { role, branchId } = req.query;
    let list = [...users];
    if (role) {
      list = list.filter((u) => u.role === role);
    }
    if (branchId) {
      list = list.filter((u) => u.branchId === branchId);
    }
    res.json(list);
  });

  app.post('/api/users', (req, res) => {
    const newUser: User = req.body;
    const existingIndex = users.findIndex((u) => u.id === newUser.id);
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...newUser };
    } else {
      newUser.id = newUser.id || `usr-${Date.now()}`;
      users.push(newUser);
    }
    res.json({ success: true, user: newUser });
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    users = users.filter((u) => u.id !== id);
    res.json({ success: true });
  });

  // --- STAFF ATTENDANCE & SALARY CONFIG ---

  app.get('/api/staff-attendance', (req, res) => {
    const { branchId, date, staffId } = req.query;
    let list = [...staffAttendance];
    if (branchId) list = list.filter((sa) => sa.branchId === branchId);
    if (date) list = list.filter((sa) => sa.date === date);
    if (staffId) list = list.filter((sa) => sa.staffId === staffId);
    res.json(list);
  });

  app.post('/api/staff-attendance', (req, res) => {
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

  app.get('/api/calendar-config', (req, res) => {
    res.json(calendarConfig);
  });

  app.post('/api/calendar-config', (req, res) => {
    calendarConfig = { ...calendarConfig, ...req.body };
    res.json({ success: true, config: calendarConfig });
  });

  // --- ONLINE ADMISSIONS FORM ---

  app.get('/api/admissions', (req, res) => {
    res.json(admissions.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()));
  });

  app.post('/api/admissions', (req, res) => {
    const appData: Partial<AdmissionApplication> = req.body;
    const selectedBranch = branches.find((b) => b.id === appData.branchId) || branches[0];

    const newApplication: AdmissionApplication = {
      id: `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: appData.studentName || 'Applicant',
      dateOfBirth: appData.dateOfBirth || '2010-01-01',
      gradeApplying: appData.gradeApplying || 'Grade 10',
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      parentName: appData.parentName || 'Parent',
      parentPhone: appData.parentPhone || '',
      parentEmail: appData.parentEmail || '',
      previousSchool: appData.previousSchool || 'N/A',
      address: appData.address || '',
      notes: appData.notes || '',
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    admissions.unshift(newApplication);
    res.json({ success: true, application: newApplication });
  });

  app.post('/api/admissions/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'

    const targetAdm = admissions.find((a) => a.id === id);
    if (!targetAdm) {
      return res.status(404).json({ error: 'Admission application not found.' });
    }

    targetAdm.status = status;

    // If approved, create the student user
    if (status === 'approved') {
      const studentIdNum = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newStudentUser: User = {
        id: `stu-${Date.now()}`,
        name: targetAdm.studentName,
        email: `${targetAdm.studentName.toLowerCase().replace(/\s+/g, '.')}@student.edupulse.edu`,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        gradeLevel: targetAdm.gradeApplying,
        branchId: targetAdm.branchId,
        branchName: targetAdm.branchName,
        studentIdNumber: studentIdNum,
        parentContact: targetAdm.parentPhone,
      };
      users.push(newStudentUser);
    }

    res.json({ success: true, application: targetAdm });
  });

  // --- TEACHER TOPICS, LEAVES, ASSESSMENTS ---

  app.get('/api/teacher/topics', (req, res) => {
    const { teacherId, courseId } = req.query;
    let list = [...topicPlans];
    if (teacherId) list = list.filter((t) => t.teacherId === teacherId);
    if (courseId) list = list.filter((t) => t.courseId === courseId);
    res.json(list);
  });

  app.post('/api/teacher/topics', (req, res) => {
    const plan: TeacherTopicPlan = req.body;
    plan.id = plan.id || `tp-${Date.now()}`;
    const idx = topicPlans.findIndex((t) => t.id === plan.id);
    if (idx >= 0) {
      topicPlans[idx] = plan;
    } else {
      topicPlans.push(plan);
    }
    res.json({ success: true, topic: plan });
  });

  app.patch('/api/teacher/topics/:id', (req, res) => {
    const { id } = req.params;
    const idx = topicPlans.findIndex((t) => t.id === id);
    if (idx >= 0) {
      topicPlans[idx] = { ...topicPlans[idx], ...req.body };
      return res.json({ success: true, topic: topicPlans[idx] });
    }
    res.status(404).json({ error: 'Topic plan not found' });
  });

  app.get('/api/leaves', (req, res) => {
    const { applicantId } = req.query;
    if (applicantId) {
      return res.json(leaveApplications.filter((l) => l.applicantId === applicantId));
    }
    res.json(leaveApplications);
  });

  app.post('/api/leaves', (req, res) => {
    const leave: LeaveApplication = req.body;
    leave.id = `lv-${Date.now()}`;
    leave.status = 'pending';
    leave.createdAt = new Date().toISOString().split('T')[0];
    leaveApplications.unshift(leave);
    res.json({ success: true, leave });
  });

  app.patch('/api/leaves/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const idx = leaveApplications.findIndex((l) => l.id === id);
    if (idx >= 0) {
      leaveApplications[idx].status = status;
      return res.json({ success: true, leave: leaveApplications[idx] });
    }
    res.status(404).json({ error: 'Leave application not found' });
  });

  app.get('/api/assessments', (req, res) => {
    const { courseId } = req.query;
    if (courseId) {
      return res.json(assessments.filter((a) => a.courseId === courseId));
    }
    res.json(assessments);
  });

  app.post('/api/assessments', (req, res) => {
    const item: AssessmentItem = req.body;
    item.id = item.id || `asm-${Date.now()}`;
    assessments.push(item);
    res.json({ success: true, assessment: item });
  });

  // --- ACADEMIC COURSES, SCHEDULE, GRADES, ANNOUNCEMENTS ---

  app.get('/api/courses', (req, res) => {
    res.json(courses);
  });

  app.post('/api/courses', (req, res) => {
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

  app.get('/api/schedule', (req, res) => {
    res.json(schedule);
  });

  app.post('/api/schedule', (req, res) => {
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

  app.get('/api/attendance', (req, res) => {
    const { studentId, courseId, date } = req.query;
    let filtered = [...attendance];
    if (studentId) filtered = filtered.filter((a) => a.studentId === studentId);
    if (courseId) filtered = filtered.filter((a) => a.courseId === courseId);
    if (date) filtered = filtered.filter((a) => a.date === date);
    res.json(filtered);
  });

  app.post('/api/attendance/batch', (req, res) => {
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

  app.get('/api/grades', (req, res) => {
    const { studentId, courseId } = req.query;
    let filtered = [...grades];
    if (studentId) filtered = filtered.filter((g) => g.studentId === studentId);
    if (courseId) filtered = filtered.filter((g) => g.courseId === courseId);
    res.json(filtered);
  });

  app.post('/api/grades', (req, res) => {
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

  app.delete('/api/grades/:id', (req, res) => {
    const { id } = req.params;
    grades = grades.filter((g) => g.id !== id);
    res.json({ success: true });
  });

  app.get('/api/announcements', (req, res) => {
    res.json(announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  });

  app.post('/api/announcements', (req, res) => {
    const ann: Announcement = req.body;
    ann.id = ann.id || `ann-${Date.now()}`;
    ann.date = ann.date || new Date().toISOString().split('T')[0];
    announcements.unshift(ann);
    res.json({ success: true, announcement: ann });
  });

  // Calculated School Statistics
  app.get('/api/stats', (req, res) => {
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

  // Reset Data to Default Seeds
  app.post('/api/reset-data', (req, res) => {
    users = [...INITIAL_USERS];
    courses = [...INITIAL_COURSES];
    schedule = [...INITIAL_SCHEDULE];
    attendance = [...INITIAL_ATTENDANCE];
    grades = [...INITIAL_GRADES];
    announcements = [...INITIAL_ANNOUNCEMENTS];
    branches = [...INITIAL_BRANCHES];
    rooms = [...INITIAL_ROOMS];
    calendarConfig = { ...INITIAL_CALENDAR_CONFIG };
    staffAttendance = [...INITIAL_STAFF_ATTENDANCE];
    admissions = [...INITIAL_ADMISSIONS];
    topicPlans = [...INITIAL_TOPIC_PLANS];
    leaveApplications = [...INITIAL_LEAVES];
    assessments = [...INITIAL_ASSESSMENTS];
    res.json({ success: true, message: 'School database successfully reset to default state.' });
  });

  // --- GEMINI AI INTEGRATION ENDPOINTS ---

  // 1. Executive Principal Insights
  app.post('/api/ai/executive-summary', async (req, res) => {
    try {
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          summary:
            "**Executive School Performance Report (Fallback Summary)**\n\n- **Overall Attendance**: Currently sitting at 94.2% across Grade 10-12. Physics and CS labs show 98% engagement.\n- **Academic Performance**: School-wide GPA average is 3.58. STEM courses show high performance in project-based assessments.\n- **Areas of Attention**: 2 students are currently flagged for attendance follow-up in morning sessions.\n- **Strategic Recommendation**: Expand faculty workshop on AI tools and set up automated tardy notifications for parents.",
          source: 'simulated',
        });
      }

      const prompt = `You are an expert AI Education Policy Analyst assisting a School Principal. 
Here are current real-time metrics:
Total Students: ${users.filter((u) => u.role === 'student').length}
Total Courses: ${courses.length}
Attendance Records Count: ${attendance.length}
Grades Recorded Count: ${grades.length}

Generate a concise, professional executive summary with 4 bullet points:
1. Overall School Climate & Attendance Assessment
2. Academic Achievement & Grade Highlights
3. Immediate At-Risk Intervention Priorities
4. Recommended Next Steps for Department Chairs`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ summary: response.text, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini AI error:', err);
      res.json({
        summary:
          "**Executive School Performance Report**\n\n- **Attendance**: High participation across morning STEM and Humanities blocks.\n- **Grades**: Math and CS departments show strong project outcomes.\n- **Interventions**: Automated alert active for students with below 80% attendance.\n- **Faculty Focus**: Recommended peer mentoring between senior and junior department chairs.",
        source: 'fallback',
      });
    }
  });

  // 2. AI Teacher Lesson Plan Generator
  app.post('/api/ai/generate-lesson-plan', async (req, res) => {
    const { courseName, topic, gradeLevel, durationMinutes } = req.body;
    try {
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          plan: `### Lesson Plan: ${topic || 'Key Concepts'} (${courseName || 'General Subject'})\n**Target Level**: ${gradeLevel || 'High School'} | **Duration**: ${durationMinutes || 60} mins\n\n1. **Warm-up & Prior Knowledge (10 mins)**: Interactive quiz and concept review.\n2. **Direct Instruction (20 mins)**: Core lecture with visual diagrams and worked examples.\n3. **Guided Group Activity (20 mins)**: Problem-solving in pairs with teacher guidance.\n4. **Formative Assessment & Exit Ticket (10 mins)**: Individual reflection prompt.`,
          source: 'simulated',
        });
      }

      const prompt = `Create a structured, highly effective lesson plan for a teacher in high school:
Course: ${courseName}
Topic: ${topic}
Grade Level: ${gradeLevel}
Duration: ${durationMinutes || 60} minutes

Format with markdown headings:
- Learning Objectives (2 bullet points)
- Required Materials / Pre-requisites
- Minute-by-minute Time Breakdown (Warm-up, Core Concept, Activity, Wrap-up)
- Formative Assessment / Exit Ticket Question`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ plan: response.text, source: 'gemini' });
    } catch (err: any) {
      res.json({
        plan: `### Lesson Plan: ${topic || 'Core Topic'}\n- **Objectives**: Master foundational principles and apply to problem sets.\n- **Breakdown**: 10m Warmup, 25m Conceptual Explanation, 20m Lab Practice, 5m Exit Ticket.`,
        source: 'fallback',
      });
    }
  });

  // 3. AI Student Report & Progress Feedback
  app.post('/api/ai/student-report-comment', async (req, res) => {
    const { studentName, courseName, currentGrade, attendancePercent, recentStrengths } = req.body;
    try {
      const ai = getGenAI();
      if (!ai) {
        return res.json({
          comment: `${studentName} demonstrates remarkable commitment in ${courseName}. With a grade score of ${currentGrade}% and an attendance rate of ${attendancePercent}%, they consistently contribute thoughtful insights during class discussions. Continuing to review assignment feedback will help maintain this strong momentum.`,
          source: 'simulated',
        });
      }

      const prompt = `Generate a warm, constructive, professional teacher report card comment for a student:
Student Name: ${studentName}
Course: ${courseName}
Current Grade Percentage: ${currentGrade}%
Attendance Rate: ${attendancePercent}%
Noted Strengths: ${recentStrengths || 'Active participation and steady assignment completion'}

Write 3 sentences: 1 praise line, 1 technical strength, and 1 encouraging growth tip.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ comment: response.text, source: 'gemini' });
    } catch (err: any) {
      res.json({
        comment: `${studentName} continues to make positive progress in ${courseName}. Their current grade of ${currentGrade}% reflects dedicated work ethic and active involvement. Keep up the high standard!`,
        source: 'fallback',
      });
    }
  });

  // VITE MIDDLEWARE SETUP
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
