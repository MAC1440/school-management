import { baseApi } from '../baseApi';
import { User } from '../../features/auth/types';

export const usersApi = baseApi.injectEndpoints({
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
  }),
});

export const { useGetUsersQuery, useSaveUserMutation, useDeleteUserMutation } = usersApi;
