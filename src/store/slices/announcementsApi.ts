import { baseApi } from '../baseApi';
import { Announcement } from '../../features/shared/types';

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<Announcement[], void>({
      query: () => '/announcements',
      providesTags: ['Announcements'],
    }),

    saveAnnouncement: builder.mutation<
      { success: boolean; announcement: Announcement },
      Partial<Announcement>
    >({
      query: (ann) => ({
        url: '/announcements',
        method: 'POST',
        body: ann,
      }),
      invalidatesTags: ['Announcements'],
    }),
  }),
});

export const { useGetAnnouncementsQuery, useSaveAnnouncementMutation } = announcementsApi;
