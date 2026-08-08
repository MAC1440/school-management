import { baseApi } from '../baseApi';
import { GradeRecord } from '../../features/student/types';

export const gradesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetGradesQuery, useSaveGradeMutation, useDeleteGradeMutation } = gradesApi;
