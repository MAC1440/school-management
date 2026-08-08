import { baseApi } from '../baseApi';
import { Branch } from '../../features/admin/types';

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetBranchesQuery, useSaveBranchMutation, useDeleteBranchMutation } = branchesApi;
