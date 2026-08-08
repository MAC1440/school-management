import { Role } from '../auth/types';

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

export type AttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'leave';

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: Role;
  branchId: string;
  branchName: string;
  date: string;
  checkInTime: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface SchoolCalendarConfig {
  totalWorkingDaysPerMonth: number;
  perDayPenaltyRate: number;
  holidays: { date: string; name: string }[];
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  overallAttendanceRate: number;
  averageGpa: number;
  atRiskStudentsCount: number;
  totalBranches?: number;
  pendingAdmissionsCount?: number;
}
