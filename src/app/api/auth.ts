import type { PasswordResetFormData, SigninFormData, SigninReturnType, SignupFormData } from "../../utils/types";
import api from "../apiSlice";


const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SigninReturnType, SigninFormData>({
            query: (body) => ({
                url: "/auth",
                method: "POST",
                body
            }),
        }),
        signUp: builder.mutation<{ message: string }, SignupFormData>({
            query: (body) => ({
                url: "/signup",
                method: "POST",
                body
            }),
        }),
        signOut: builder.mutation<{ message: string }, object>({
            query: () => ({
                url: "/auth/signout",
                method: "POST",
                body: {}
            }),
        }),
        verifyEmail: builder.query({
            query: (token) => `/auth/verify/${token}`,
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: "/auth/forgotpassword",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<{ message: string }, PasswordResetFormData>({
            query: (body) => ({
                url: "/auth/resetpassword",
                method: "POST",
                body,
            }),
        }),
    }),
});


export const { useSignInMutation, useSignUpMutation, useSignOutMutation, useVerifyEmailQuery, useForgotPasswordMutation, useResetPasswordMutation } = authApi;