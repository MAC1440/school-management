import { baseApi } from '../baseApi';
import { SchoolStats } from '../../features/admin/types';

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<SchoolStats, void>({
      query: () => '/stats',
      providesTags: ['Stats'],
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

export const { useGetStatsQuery, useResetDatabaseMutation } = statsApi;
