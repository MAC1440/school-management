import { baseApi } from '../baseApi';
import { TeacherTopicPlan } from '../../features/teacher/types';

export const teacherTopicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetTeacherTopicsQuery,
  useSaveTeacherTopicMutation,
  useUpdateTopicStatusMutation,
} = teacherTopicsApi;
