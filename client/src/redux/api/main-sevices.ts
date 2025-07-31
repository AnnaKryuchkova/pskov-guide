import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CategoryResponse,
  LoginApiProps,
  LoginApiResponse,
  LogoutApiResponse,
  RegistrationApiProps,
  RegistrationResponse,
  UserProps,
  UserResponse,
} from './type';
import {
  REGISTRATION_URL,
  LOGIN_URL,
  USER_URL,
  CATEGORY_URL,
  LOGOUT_URL,
  UPDATEUSER_URL,
} from './endpoint';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pskov-guide.onrender.com/api',
    credentials: 'include',
  }),
  tagTypes: ['main', 'Like', 'User'],
  endpoints: (builder) => ({
    postRegistration: builder.mutation<RegistrationResponse, RegistrationApiProps>({
      query: (body) => ({
        url: REGISTRATION_URL,
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<LoginApiResponse, LoginApiProps>({
      query: (body) => ({
        url: LOGIN_URL,
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<LogoutApiResponse, void>({
      query: () => ({
        url: LOGOUT_URL,
        method: 'POST',
        invalidatesTags: ['User'],
      }),
    }),
    getUser: builder.query<UserResponse, UserProps>({
      query: (params) => ({
        url: USER_URL,
        method: 'GET',
        params,
      }),
      providesTags: [{ type: 'User', id: 'CURRENT' }], // Добавляем теги
    }),
    putUser: builder.mutation<UserResponse, Partial<UserResponse>>({
      query: (body) => ({
        url: UPDATEUSER_URL,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }], // Важно!
    }),
    getCategories: builder.query<CategoryResponse, unknown>({
      query: () => ({
        url: CATEGORY_URL,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  usePostRegistrationMutation,
  useLoginMutation,
  useGetUserQuery,
  useGetCategoriesQuery,
  useLogoutMutation,
  usePutUserMutation,
} = mainApi;
