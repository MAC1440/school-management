import { baseApi } from '../baseApi';
import { StaffAttendanceRecord } from '../../features/admin/types';
import { AttendanceRecord } from '../../features/teacher/types';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetStaffAttendanceQuery,
  useSaveStaffAttendanceMutation,
  useGetAttendanceQuery,
  useSubmitBatchAttendanceMutation,
} = attendanceApi;
