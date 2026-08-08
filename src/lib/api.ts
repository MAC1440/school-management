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
  TopicPlan,
} from '../types';

// Helper for Auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('edupulse_jwt');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// --- AUTHENTICATION & JWT APIs ---

export async function loginWithCredentials(data: { email?: string; userId?: string; role?: string }): Promise<{ token: string; user: User }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function fetchCurrentAuthUser(): Promise<User> {
  const res = await fetch('/api/auth/me', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Unauthenticated');
  }
  const data = await res.json();
  return data.user;
}

export const fetchCurrentUserWithJwt = fetchCurrentAuthUser;

export async function verifyKioskPin(staffId: string, pin: string, branchId?: string): Promise<{ success: boolean; message: string; staffName: string; checkInTime: string }> {
  const res = await fetch('/api/auth/kiosk-verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ staffId, pin, branchId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'PIN Verification failed');
  }
  return res.json();
}

// --- BRANCHES & ROOMS ---

export async function fetchBranches(): Promise<Branch[]> {
  const res = await fetch('/api/branches');
  if (!res.ok) throw new Error('Failed to fetch branches');
  return res.json();
}

export async function saveBranch(branch: Partial<Branch>): Promise<{ success: boolean; branch: Branch }> {
  const res = await fetch('/api/branches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(branch),
  });
  if (!res.ok) throw new Error('Failed to save branch');
  return res.json();
}

export async function deleteBranch(id: string): Promise<void> {
  await fetch(`/api/branches/${id}`, { method: 'DELETE' });
}

export async function fetchRooms(branchId?: string): Promise<Room[]> {
  const url = branchId ? `/api/rooms?branchId=${branchId}` : '/api/rooms';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function saveRoom(room: Partial<Room>): Promise<{ success: boolean; room: Room }> {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error('Failed to save room');
  return res.json();
}

export async function deleteRoom(id: string): Promise<void> {
  await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
}

// --- USERS & STAFF MANAGEMENT ---

export async function fetchUsers(role?: string, branchId?: string): Promise<User[]> {
  const params = new URLSearchParams();
  if (role) params.append('role', role);
  if (branchId) params.append('branchId', branchId);
  const res = await fetch(`/api/users?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function saveUser(user: Partial<User>): Promise<{ success: boolean; user: User }> {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to save user');
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  await fetch(`/api/users/${id}`, { method: 'DELETE' });
}

// --- STAFF ATTENDANCE & SALARY CONFIG ---

export async function fetchStaffAttendance(branchId?: string, date?: string, staffId?: string): Promise<StaffAttendanceRecord[]> {
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId);
  if (date) params.append('date', date);
  if (staffId) params.append('staffId', staffId);

  const res = await fetch(`/api/staff-attendance?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch staff attendance');
  return res.json();
}

export async function saveStaffAttendance(record: Partial<StaffAttendanceRecord>): Promise<{ success: boolean; record: StaffAttendanceRecord }> {
  const res = await fetch('/api/staff-attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Failed to save staff attendance');
  return res.json();
}

export async function fetchCalendarConfig(): Promise<SchoolCalendarConfig> {
  const res = await fetch('/api/calendar-config');
  if (!res.ok) throw new Error('Failed to fetch calendar config');
  return res.json();
}

export async function saveCalendarConfig(config: Partial<SchoolCalendarConfig>): Promise<{ success: boolean; config: SchoolCalendarConfig }> {
  const res = await fetch('/api/calendar-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to save calendar config');
  return res.json();
}

// --- ONLINE ADMISSIONS FORM ---

export async function fetchAdmissions(): Promise<AdmissionApplication[]> {
  const res = await fetch('/api/admissions');
  if (!res.ok) throw new Error('Failed to fetch admissions');
  return res.json();
}

export async function submitAdmissionForm(data: Partial<AdmissionApplication>): Promise<{ success: boolean; application: AdmissionApplication }> {
  const res = await fetch('/api/admissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit admission application');
  return res.json();
}

export async function updateAdmissionStatus(id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; application: AdmissionApplication }> {
  const res = await fetch(`/api/admissions/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update admission status');
  return res.json();
}

// --- TEACHER TOPICS, LEAVES & ASSESSMENTS ---

export async function fetchTeacherTopics(teacherId?: string, courseId?: string): Promise<TeacherTopicPlan[]> {
  const params = new URLSearchParams();
  if (teacherId) params.append('teacherId', teacherId);
  if (courseId) params.append('courseId', courseId);
  const res = await fetch(`/api/teacher/topics?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch topic plans');
  return res.json();
}

export async function fetchTopicPlans(courseId: string): Promise<TopicPlan[]> {
  const list = await fetchTeacherTopics(undefined, courseId);
  if (!Array.isArray(list)) return [];
  return list.map((t) => ({
    id: t.id,
    topicTitle: t.topicTitle,
    plannedDate: t.plannedDate,
    isCompleted: t.status === 'covered',
    durationMinutes: t.durationMinutes || 60,
  }));
}

export async function toggleTopicCompletion(courseId: string, topicId: string): Promise<TopicPlan[]> {
  await fetch(`/api/teacher/topics/${topicId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'covered' }),
  });
  return fetchTopicPlans(courseId);
}

export async function saveTeacherTopic(plan: Partial<TeacherTopicPlan>): Promise<{ success: boolean; topic: TeacherTopicPlan }> {
  const res = await fetch('/api/teacher/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  });
  if (!res.ok) throw new Error('Failed to save topic plan');
  return res.json();
}

export async function updateTopicStatus(id: string, status: 'planned' | 'covered' | 'delayed'): Promise<void> {
  await fetch(`/api/teacher/topics/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function fetchLeaves(applicantId?: string): Promise<LeaveApplication[]> {
  const url = applicantId ? `/api/leaves?applicantId=${applicantId}` : '/api/leaves';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch leaves');
  return res.json();
}

export async function submitLeaveRequest(data: Partial<LeaveApplication>): Promise<{ success: boolean; leave: LeaveApplication }> {
  const res = await fetch('/api/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit leave request');
  return res.json();
}

export const submitLeaveApplication = submitLeaveRequest;

export async function updateLeaveStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  await fetch(`/api/leaves/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export async function fetchAssessments(courseId?: string): Promise<AssessmentItem[]> {
  const url = courseId ? `/api/assessments?courseId=${courseId}` : '/api/assessments';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  return res.json();
}

export async function saveAssessment(item: Partial<AssessmentItem>): Promise<{ success: boolean; assessment: AssessmentItem }> {
  const res = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to save assessment');
  return res.json();
}

// --- ACADEMIC COURSES, SCHEDULE, GRADES, ANNOUNCEMENTS & STATS ---

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses');
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function saveCourse(course: Partial<Course>): Promise<{ success: boolean; course: Course }> {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course),
  });
  if (!res.ok) throw new Error('Failed to save course');
  return res.json();
}

export async function fetchSchedule(): Promise<ScheduleItem[]> {
  const res = await fetch('/api/schedule');
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
}

export async function saveScheduleItem(item: Partial<ScheduleItem>): Promise<{ success: boolean; item: ScheduleItem }> {
  const res = await fetch('/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to save schedule item');
  return res.json();
}

export async function fetchAttendance(studentId?: string, courseId?: string, date?: string): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (studentId) params.append('studentId', studentId);
  if (courseId) params.append('courseId', courseId);
  if (date) params.append('date', date);

  const res = await fetch(`/api/attendance?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function submitBatchAttendance(records: AttendanceRecord[]): Promise<boolean> {
  const res = await fetch('/api/attendance/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records }),
  });
  if (!res.ok) throw new Error('Failed to submit attendance');
  const data = await res.json();
  return data.success;
}

export async function fetchGrades(studentId?: string, courseId?: string): Promise<GradeRecord[]> {
  const params = new URLSearchParams();
  if (studentId) params.append('studentId', studentId);
  if (courseId) params.append('courseId', courseId);

  const res = await fetch(`/api/grades?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch grades');
  return res.json();
}

export async function saveGrade(grade: Partial<GradeRecord>): Promise<{ success: boolean; grade: GradeRecord }> {
  const res = await fetch('/api/grades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(grade),
  });
  if (!res.ok) throw new Error('Failed to save grade');
  return res.json();
}

export async function deleteGrade(id: string): Promise<void> {
  await fetch(`/api/grades/${id}`, { method: 'DELETE' });
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await fetch('/api/announcements');
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}

export async function saveAnnouncement(ann: Partial<Announcement>): Promise<{ success: boolean; announcement: Announcement }> {
  const res = await fetch('/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ann),
  });
  if (!res.ok) throw new Error('Failed to save announcement');
  return res.json();
}

export async function fetchSchoolStats(): Promise<SchoolStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function resetDatabase(): Promise<boolean> {
  const res = await fetch('/api/reset-data', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
  const data = await res.json();
  return data.success;
}
