import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ApproveNotPlaceResponse,
  EditPlaceProps,
  NotPlaceProps,
  NotPlaceResponse,
  PlaceResponse,
  RejectNotPlaceResponse,
  UserLikesResponse,
} from './type';
import {
  PLACE_URL,
  LIKE_URL,
  NOT_PLACE_URL,
  NOT_PLACE_APPROVE_URL,
  NOT_PLACE_REJECT_URL,
  MODERATION_URL,
} from './endpoint';

export const placeApi = createApi({
  reducerPath: 'placeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pskov-guide.onrender.com/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Like', 'Place', 'NotPlace'],
  endpoints: (builder) => ({
    addLike: builder.mutation<{ message: string }, { placeId: number }>({
      query: (body) => ({
        url: LIKE_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Like'],
    }),
    // Добавление нового места на модерацию
    createNotPlace: builder.mutation<NotPlaceResponse, NotPlaceProps>({
      query: (body) => ({
        url: NOT_PLACE_URL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['NotPlace'],
    }),
    getPlaces: builder.query<PlaceResponse[], number>({
      query: (id) => ({
        url: `${PLACE_URL}/${id}`,
        method: 'GET',
      }),
    }),
    // Получение списка мест на модерации
    getNotPlacesForModeration: builder.query<NotPlaceResponse[], void>({
      query: () => ({
        url: MODERATION_URL,
        method: 'GET',
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('token')}`,
        // },
      }),
      providesTags: ['NotPlace'],
    }),

    // Одобрение места
    approveNotPlace: builder.mutation<ApproveNotPlaceResponse, number>({
      query: (id) => ({
        url: `${NOT_PLACE_APPROVE_URL}/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['NotPlace', 'Place'],
    }),

    // Отклонение места
    rejectNotPlace: builder.mutation<RejectNotPlaceResponse, number>({
      query: (id) => ({
        url: `${NOT_PLACE_REJECT_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NotPlace'],
    }),
    // удаление места
    deletePlace: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${PLACE_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    // изменение места
    editePlace: builder.mutation<PlaceResponse, { id: string | number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `${PLACE_URL}/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    removeLike: builder.mutation<{ message: string }, { placeId: number }>({
      query: (placeId) => ({
        url: `${LIKE_URL}/${placeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Like'],
    }),
    checkLike: builder.query<{ isLiked: boolean }, number>({
      query: (placeId) => `${LIKE_URL}/${placeId}`,
    }),
    getUserLikes: builder.query<UserLikesResponse, void>({
      query: () => ({
        url: '/user/likes',
        headers: {
          Authorization: 'include',
        },
      }),
      providesTags: ['Like'],
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useAddLikeMutation,
  useCheckLikeQuery,
  useRemoveLikeMutation,
  useGetUserLikesQuery,
  useCreateNotPlaceMutation,
  useGetNotPlacesForModerationQuery,
  useApproveNotPlaceMutation,
  useRejectNotPlaceMutation,
  useDeletePlaceMutation,
  useEditePlaceMutation,
} = placeApi;
