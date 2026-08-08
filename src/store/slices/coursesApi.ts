import { baseApi } from '../baseApi';
import { Course } from '../../features/teacher/types';

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetCoursesQuery, useSaveCourseMutation } = coursesApi;
