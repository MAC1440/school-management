export type Role = 'admin' | 'principal' | 'teacher' | 'student' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department?: string;
  branchId?: string;
  branchName?: string;
  pin?: string; // 4-digit PIN for Kiosk
  baseSalary?: number; // Monthly base salary
  gradeLevel?: string; // For students e.g. "Grade 11"
  subjects?: string[]; // For teachers e.g. ["AP Physics", "Calculus"]
  studentIdNumber?: string;
  parentContact?: string;
  phone?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  principalName: string;
}

export interface Room {
  id: string;
  branchId: string;
  roomNumber: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'hall';
}

export type DaysOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  teacherId: string;
  teacherName: string;
  room: string;
  gradeLevel: string;
  color: string;
  enrolledStudentIds: string[];
  branchId?: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  room: string;
  day: DaysOfWeek;
  period: number; // 1 to 6
  startTime: string;
  endTime: string;
  color: string;
  branchId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'leave';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: Role;
  branchId: string;
  branchName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM AM/PM
  status: AttendanceStatus;
  notes?: string;
}

export type GradeCategory = 'Homework' | 'Quiz' | 'Midterm' | 'Final' | 'Project';

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  title: string;
  category: GradeCategory;
  score: number;
  maxScore: number;
  date: string;
  feedback?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: Role;
  date: string;
  priority: 'urgent' | 'normal' | 'info';
  targetAudience: 'all' | 'students' | 'teachers' | 'principals';
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  overallAttendanceRate: number; // Percentage
  averageGpa: number;
  atRiskStudentsCount: number;
  totalBranches?: number;
  pendingAdmissionsCount?: number;
}

export interface SchoolCalendarConfig {
  totalWorkingDaysPerMonth: number;
  perDayPenaltyRate: number; // e.g. $150 per unexcused absence
  holidays: { date: string; name: string }[];
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gradeApplying: string;
  branchId: string;
  branchName: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  previousSchool: string;
  address: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface TeacherTopicPlan {
  id: string;
  teacherId: string;
  courseId: string;
  courseName: string;
  topicTitle: string;
  plannedDate: string;
  durationMinutes?: number;
  status: 'planned' | 'covered' | 'delayed';
  notes?: string;
}

export interface TopicPlan {
  id: string;
  topicTitle: string;
  plannedDate: string;
  isCompleted: boolean;
  durationMinutes: number;
}

export interface LeaveApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  role?: Role;
  applicantRole?: Role;
  branchId?: string;
  startDate: string;
  endDate: string;
  leaveType: 'sick' | 'casual' | 'vacation' | 'maternity' | 'unpaid';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface AssessmentItem {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'Quiz' | 'Test' | 'Exam' | 'Paper';
  dueDate: string;
  weightage: string;
  description?: string;
  scheduledDate?: string;
  totalMarks?: number;
  syllabusTopics?: string[];
}
