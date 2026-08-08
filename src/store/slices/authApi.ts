import { baseApi } from '../baseApi';
import { User } from '../../features/auth/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: User }, { email?: string; userId?: string; role?: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    verifyKioskPin: builder.mutation<
      { success: boolean; message: string; staffName: string; checkInTime: string },
      { staffId: string; pin: string; branchId?: string }
    >({
      query: (body) => ({
        url: '/auth/kiosk-verify-pin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StaffAttendance'],
    }),
  }),
});

export const { useLoginMutation, useVerifyKioskPinMutation } = authApi;
