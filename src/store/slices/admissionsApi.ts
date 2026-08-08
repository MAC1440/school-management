import { baseApi } from '../baseApi';
import { AdmissionApplication } from '../../features/landing/types';

export const admissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmissions: builder.query<AdmissionApplication[], void>({
      query: () => '/admissions',
      providesTags: ['Admissions'],
    }),

    submitAdmission: builder.mutation<
      { success: boolean; application: AdmissionApplication },
      Partial<AdmissionApplication>
    >({
      query: (data) => ({
        url: '/admissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admissions', 'Stats'],
    }),

    updateAdmissionStatus: builder.mutation<
      { success: boolean; application: AdmissionApplication },
      { id: string; status: 'approved' | 'rejected' }
    >({
      query: ({ id, status }) => ({
        url: `/admissions/${id}/status`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: ['Admissions', 'Users', 'Stats'],
    }),
  }),
});

export const {
  useGetAdmissionsQuery,
  useSubmitAdmissionMutation,
  useUpdateAdmissionStatusMutation,
} = admissionsApi;
