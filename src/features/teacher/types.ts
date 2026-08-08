import { AttendanceStatus } from '../admin/types';

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
  period: number;
  startTime: string;
  endTime: string;
  color: string;
  branchId?: string;
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

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}
