import type { User } from "../../utils/types";
import api from "../apiSlice";


const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addUser: builder.mutation<User, FormData>({
            query: (body) => ({
                url: "/users",
                method: "POST",
                body,
            }),
            invalidatesTags: (result) => result ? [{ type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }] : [{ type: "User" as const, id: "LIST" }]
        }),
        getUsers: builder.query<User[], null>({
            query: () => "/users",
            providesTags: (result) => result ? [
                ...result.map(user => ({ type: "User" as const, id: user.id })), { type: "User" as const, id: "LIST" }
            ] : [{ type: "User" as const, id: "LIST" }]
        }),
        getUser: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result) => result ? [
                {type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }
            ] : [{ type: "User" as const, id: "LIST" }]
        }),
        updateUser: builder.mutation<User, {id: string, body: FormData}>({
            query: ({id, body}) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: (result) => result ? [
                {type: "User" as const, id: result.id }, { type: "User" as const, id: "LIST" }
            ] : [{ type: "User" as const, id: "LIST" }]
        }),
        deleteUser: builder.mutation<User, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result) => result ? [
                {type: "User" as const, id: result.id }, { type: "Dispatch" as const, id: "LIST" }, { type: "User" as const, id: "LIST" }
            ] : [{ type: "User" as const, id: "LIST" }, { type: "Dispatch" as const, id: "LIST" }]
        })
    }),
});

export const {
    useAddUserMutation,
    useUpdateUserMutation,
    useGetUsersQuery,
    useGetUserQuery,
    useDeleteUserMutation
} = userApi;