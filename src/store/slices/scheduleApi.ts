import { baseApi } from '../baseApi';
import { ScheduleItem } from '../../features/teacher/types';

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedule: builder.query<ScheduleItem[], void>({
      query: () => '/schedule',
      providesTags: ['Schedule'],
    }),

    saveScheduleItem: builder.mutation<{ success: boolean; item: ScheduleItem }, Partial<ScheduleItem>>({
      query: (item) => ({
        url: '/schedule',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const { useGetScheduleQuery, useSaveScheduleItemMutation } = scheduleApi;
