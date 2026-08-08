import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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
} from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('edupulse_jwt');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Users',
    'Courses',
    'Branches',
    'Rooms',
    'StaffAttendance',
    'Admissions',
    'Leaves',
    'CalendarConfig',
    'Announcements',
    'Stats',
    'Schedule',
    'Attendance',
    'Grades',
    'Assessments',
    'TeacherTopics',
  ],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], { role?: string; branchId?: string } | void>({
      query: (params) => {
        const p = params || {};
        const search = new URLSearchParams();
        if (p.role) search.append('role', p.role);
        if (p.branchId) search.append('branchId', p.branchId);
        const queryStr = search.toString();
        return queryStr ? `/users?${queryStr}` : '/users';
      },
      providesTags: ['Users'],
    }),

    saveUser: builder.mutation<{ success: boolean; user: User }, Partial<User>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),

    getCourses: builder.query<Course[], void>({
      query: () => '/courses',
      providesTags: ['Courses'],
    }),

    saveCourse: builder.mutation<{ success: boolean; course: Course }, Partial<Course>>({
      query: (course) => ({
        url: '/courses',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: ['Courses'],
    }),

    getBranches: builder.query<Branch[], void>({
      query: () => '/branches',
      providesTags: ['Branches'],
    }),

    saveBranch: builder.mutation<{ success: boolean; branch: Branch }, Partial<Branch>>({
      query: (branch) => ({
        url: '/branches',
        method: 'POST',
        body: branch,
      }),
      invalidatesTags: ['Branches'],
    }),

    deleteBranch: builder.mutation<void, string>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Branches'],
    }),

    getRooms: builder.query<Room[], string | void>({
      query: (branchId) => (branchId ? `/rooms?branchId=${branchId}` : '/rooms'),
      providesTags: ['Rooms'],
    }),

    saveRoom: builder.mutation<{ success: boolean; room: Room }, Partial<Room>>({
      query: (room) => ({
        url: '/rooms',
        method: 'POST',
        body: room,
      }),
      invalidatesTags: ['Rooms'],
    }),

    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms'],
    }),

    getStaffAttendance: builder.query<
      StaffAttendanceRecord[],
      { branchId?: string; date?: string; staffId?: string } | void
    >({
      query: (params) => {
        const p = params || {};
        const search = new URLSearchParams();
        if (p.branchId) search.append('branchId', p.branchId);
        if (p.date) search.append('date', p.date);
        if (p.staffId) search.append('staffId', p.staffId);
        const queryStr = search.toString();
        return queryStr ? `/staff-attendance?${queryStr}` : '/staff-attendance';
      },
      providesTags: ['StaffAttendance'],
    }),

    saveStaffAttendance: builder.mutation<
      { success: boolean; record: StaffAttendanceRecord },
      Partial<StaffAttendanceRecord>
    >({
      query: (record) => ({
        url: '/staff-attendance',
        method: 'POST',
        body: record,
      }),
      invalidatesTags: ['StaffAttendance', 'Stats'],
    }),

    getAdmissions: builder.query<AdmissionApplication[], void>({
      query: () => '/admissions',
      providesTags: ['Admissions'],
    }),

    submitAdmission: builder.mutation<
      { success: boolean; application: AdmissionApplication },
      Partial<AdmissionApplication>
    >({
      query: (data) => ({
        url: '/admissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admissions', 'Stats'],
    }),

    updateAdmissionStatus: builder.mutation<
      { success: boolean; application: AdmissionApplication },
      { id: string; status: 'approved' | 'rejected' }
    >({
      query: ({ id, status }) => ({
        url: `/admissions/${id}/status`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['Admissions', 'Users', 'Stats'],
    }),

    getLeaves: builder.query<LeaveApplication[], string | void>({
      query: (applicantId) => (applicantId ? `/leaves?applicantId=${applicantId}` : '/leaves'),
      providesTags: ['Leaves'],
    }),

    submitLeave: builder.mutation<{ success: boolean; leave: LeaveApplication }, Partial<LeaveApplication>>({
      query: (data) => ({
        url: '/leaves',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leaves'],
    }),

    updateLeaveStatus: builder.mutation<void, { id: string; status: 'approved' | 'rejected' }>({
      query: ({ id, status }) => ({
        url: `/leaves/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Leaves'],
    }),

    getCalendarConfig: builder.query<SchoolCalendarConfig, void>({
      query: () => '/calendar-config',
      providesTags: ['CalendarConfig'],
    }),

    saveCalendarConfig: builder.mutation<
      { success: boolean; config: SchoolCalendarConfig },
      Partial<SchoolCalendarConfig>
    >({
      query: (config) => ({
        url: '/calendar-config',
        method: 'POST',
        body: config,
      }),
      invalidatesTags: ['CalendarConfig'],
    }),

    getAnnouncements: builder.query<Announcement[], void>({
      query: () => '/announcements',
      providesTags: ['Announcements'],
    }),

    saveAnnouncement: builder.mutation<
      { success: boolean; announcement: Announcement },
      Partial<Announcement>
    >({
      query: (ann) => ({
        url: '/announcements',
        method: 'POST',
        body: ann,
      }),
      invalidatesTags: ['Announcements'],
    }),

    getStats: builder.query<SchoolStats, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
    }),

    getSchedule: builder.query<ScheduleItem[], void>({
      query: () => '/schedule',
      providesTags: ['Schedule'],
    }),

    getAttendance: builder.query<
      AttendanceRecord[],
      { studentId?: string; courseId?: string; date?: string } | void
    >({
      query: (params) => {
        const p = params || {};
        const search = new URLSearchParams();
        if (p.studentId) search.append('studentId', p.studentId);
        if (p.courseId) search.append('courseId', p.courseId);
        if (p.date) search.append('date', p.date);
        const queryStr = search.toString();
        return queryStr ? `/attendance?${queryStr}` : '/attendance';
      },
      providesTags: ['Attendance'],
    }),

    submitBatchAttendance: builder.mutation<boolean, AttendanceRecord[]>({
      query: (records) => ({
        url: '/attendance/batch',
        method: 'POST',
        body: { records },
      }),
      invalidatesTags: ['Attendance', 'Stats'],
    }),

    getGrades: builder.query<GradeRecord[], { studentId?: string; courseId?: string } | void>({
      query: (params) => {
        const p = params || {};
        const search = new URLSearchParams();
        if (p.studentId) search.append('studentId', p.studentId);
        if (p.courseId) search.append('courseId', p.courseId);
        const queryStr = search.toString();
        return queryStr ? `/grades?${queryStr}` : '/grades';
      },
      providesTags: ['Grades'],
    }),

    saveGrade: builder.mutation<{ success: boolean; grade: GradeRecord }, Partial<GradeRecord>>({
      query: (grade) => ({
        url: '/grades',
        method: 'POST',
        body: grade,
      }),
      invalidatesTags: ['Grades', 'Stats'],
    }),

    deleteGrade: builder.mutation<void, string>({
      query: (id) => ({
        url: `/grades/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grades', 'Stats'],
    }),

    getAssessments: builder.query<AssessmentItem[], string | void>({
      query: (courseId) => (courseId ? `/assessments?courseId=${courseId}` : '/assessments'),
      providesTags: ['Assessments'],
    }),

    saveAssessment: builder.mutation<
      { success: boolean; assessment: AssessmentItem },
      Partial<AssessmentItem>
    >({
      query: (item) => ({
        url: '/assessments',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Assessments'],
    }),

    getTeacherTopics: builder.query<
      TeacherTopicPlan[],
      { teacherId?: string; courseId?: string } | void
    >({
      query: (params) => {
        const p = params || {};
        const search = new URLSearchParams();
        if (p.teacherId) search.append('teacherId', p.teacherId);
        if (p.courseId) search.append('courseId', p.courseId);
        const queryStr = search.toString();
        return queryStr ? `/teacher/topics?${queryStr}` : '/teacher/topics';
      },
      providesTags: ['TeacherTopics'],
    }),

    saveTeacherTopic: builder.mutation<
      { success: boolean; topic: TeacherTopicPlan },
      Partial<TeacherTopicPlan>
    >({
      query: (plan) => ({
        url: '/teacher/topics',
        method: 'POST',
        body: plan,
      }),
      invalidatesTags: ['TeacherTopics'],
    }),

    updateTopicStatus: builder.mutation<
      void,
      { id: string; status: 'planned' | 'covered' | 'delayed' }
    >({
      query: ({ id, status }) => ({
        url: `/teacher/topics/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['TeacherTopics'],
    }),

    login: builder.mutation<{ token: string; user: User }, { email?: string; userId?: string; role?: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    verifyKioskPin: builder.mutation<
      { success: boolean; message: string; staffName: string; checkInTime: string },
      { staffId: string; pin: string; branchId?: string }
    >({
      query: (body) => ({
        url: '/auth/kiosk-verify-pin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StaffAttendance'],
    }),

    resetDatabase: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/reset-data',
        method: 'POST',
      }),
      invalidatesTags: [
        'Users',
        'Courses',
        'Branches',
        'Rooms',
        'StaffAttendance',
        'Admissions',
        'Leaves',
        'CalendarConfig',
        'Announcements',
        'Stats',
        'Schedule',
        'Attendance',
        'Grades',
        'Assessments',
        'TeacherTopics',
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useSaveUserMutation,
  useDeleteUserMutation,
  useGetCoursesQuery,
  useSaveCourseMutation,
  useGetBranchesQuery,
  useSaveBranchMutation,
  useDeleteBranchMutation,
  useGetRoomsQuery,
  useSaveRoomMutation,
  useDeleteRoomMutation,
  useGetStaffAttendanceQuery,
  useSaveStaffAttendanceMutation,
  useGetAdmissionsQuery,
  useSubmitAdmissionMutation,
  useUpdateAdmissionStatusMutation,
  useGetLeavesQuery,
  useSubmitLeaveMutation,
  useUpdateLeaveStatusMutation,
  useGetCalendarConfigQuery,
  useSaveCalendarConfigMutation,
  useGetAnnouncementsQuery,
  useSaveAnnouncementMutation,
  useGetStatsQuery,
  useGetScheduleQuery,
  useGetAttendanceQuery,
  useSubmitBatchAttendanceMutation,
  useGetGradesQuery,
  useSaveGradeMutation,
  useDeleteGradeMutation,
  useGetAssessmentsQuery,
  useSaveAssessmentMutation,
  useGetTeacherTopicsQuery,
  useSaveTeacherTopicMutation,
  useUpdateTopicStatusMutation,
  useLoginMutation,
  useVerifyKioskPinMutation,
  useResetDatabaseMutation,
} = apiSlice;
