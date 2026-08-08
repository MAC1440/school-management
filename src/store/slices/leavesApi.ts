import { baseApi } from '../baseApi';
import { LeaveApplication } from '../../features/principal/types';

export const leavesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetLeavesQuery, useSubmitLeaveMutation, useUpdateLeaveStatusMutation } = leavesApi;
