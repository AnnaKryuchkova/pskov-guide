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

const authResponseHandler = async (response: any) => {
  console.log('response', response);

  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

export const mainApi = createApi({
  reducerPath: 'mainApi',
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

  tagTypes: ['main', 'Like', 'User'],
  endpoints: (builder) => ({
    postRegistration: builder.mutation<RegistrationResponse, RegistrationApiProps>({
      query: (body) => ({
        url: REGISTRATION_URL,
        method: 'POST',
        body,
      }),
      transformResponse: authResponseHandler,
    }),
    login: builder.mutation<LoginApiResponse, LoginApiProps>({
      query: (body) => ({
        url: LOGIN_URL,
        method: 'POST',
        body,
      }),
      transformResponse: authResponseHandler,
    }),
    logout: builder.mutation<LogoutApiResponse, void>({
      query: () => ({
        url: LOGOUT_URL,
        method: 'POST',
        invalidatesTags: ['User'],
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          localStorage.removeItem('token');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
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
