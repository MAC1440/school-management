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
} from '../src/mockData';
import {
  User,
  Course,
  ScheduleItem,
  AttendanceRecord,
  StaffAttendanceRecord,
  GradeRecord,
  Announcement,
  Branch,
  Room,
  SchoolCalendarConfig,
  AdmissionApplication,
  TeacherTopicPlan,
  LeaveApplication,
  AssessmentItem,
} from '../src/types';

export let users: User[] = [...INITIAL_USERS];
export let courses: Course[] = [...INITIAL_COURSES];
export let schedule: ScheduleItem[] = [...INITIAL_SCHEDULE];
export let attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
export let grades: GradeRecord[] = [...INITIAL_GRADES];
export let announcements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
export let branches: Branch[] = [...INITIAL_BRANCHES];
export let rooms: Room[] = [...INITIAL_ROOMS];
export let calendarConfig: SchoolCalendarConfig = { ...INITIAL_CALENDAR_CONFIG };
export let staffAttendance: StaffAttendanceRecord[] = [...INITIAL_STAFF_ATTENDANCE];
export let admissions: AdmissionApplication[] = [...INITIAL_ADMISSIONS];
export let topicPlans: TeacherTopicPlan[] = [...INITIAL_TOPIC_PLANS];
export let leaveApplications: LeaveApplication[] = [...INITIAL_LEAVES];
export let assessments: AssessmentItem[] = [...INITIAL_ASSESSMENTS];

export function resetDb() {
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
}

export function setCalendarConfig(newConfig: Partial<SchoolCalendarConfig>) {
  calendarConfig = { ...calendarConfig, ...newConfig };
}

export function filterBranches(id?: string) {
  if (id) return branches.filter((b) => b.id !== id);
  return branches;
}

export function setBranches(newBranches: Branch[]) {
  branches = newBranches;
}

export function setRooms(newRooms: Room[]) {
  rooms = newRooms;
}

export function setUsers(newUsers: User[]) {
  users = newUsers;
}

export function setGrades(newGrades: GradeRecord[]) {
  grades = newGrades;
}
