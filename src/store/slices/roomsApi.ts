import { baseApi } from '../baseApi';
import { Room } from '../../features/admin/types';

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], string | void>({
      query: (branchId) => (branchId ? `/rooms?branchId=${branchId}` : '/rooms'),
      providesTags: ['Rooms'],
    }),

    saveRoom: builder.mutation<{ success: boolean; room: Room }, Partial<Room>>({
      query: (room) => ({
        url: '/rooms',
        method: 'POST',
        body: room,
      }),
      invalidatesTags: ['Rooms'],
    }),

    deleteRoom: builder.mutation<void, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms'],
    }),
  }),
});

export const { useGetRoomsQuery, useSaveRoomMutation, useDeleteRoomMutation } = roomsApi;
