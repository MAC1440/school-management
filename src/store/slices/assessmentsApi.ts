import { baseApi } from '../baseApi';
import { AssessmentItem } from '../../features/student/types';

export const assessmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetAssessmentsQuery, useSaveAssessmentMutation } = assessmentsApi;
