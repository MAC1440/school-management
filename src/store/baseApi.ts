import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
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
  endpoints: () => ({}),
});
