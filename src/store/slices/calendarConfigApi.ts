import { baseApi } from '../baseApi';
import { SchoolCalendarConfig } from '../../features/admin/types';

export const calendarConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarConfig: builder.query<SchoolCalendarConfig, void>({
      query: () => '/calendar-config',
      providesTags: ['CalendarConfig'],
    }),

    saveCalendarConfig: builder.mutation<
      { success: boolean; config: SchoolCalendarConfig },
      Partial<SchoolCalendarConfig>
    >({
      query: (config) => ({
        url: '/calendar-config',
        method: 'POST',
        body: config,
      }),
      invalidatesTags: ['CalendarConfig'],
    }),
  }),
});

export const { useGetCalendarConfigQuery, useSaveCalendarConfigMutation } = calendarConfigApi;
