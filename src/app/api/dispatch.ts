import type { NotificationType, Order, User } from "../../utils/types";
import api from "../apiSlice";


export const dispatchApi = api.injectEndpoints({

    endpoints: (builder) => ({
        addDispatch: builder.mutation<{message: string}, {firstname: string, lastname: string, email: string}>({
            query: (body) => ({
                url: "/dispatch",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Dispatch"],
        }),


        getRiders: builder.query<User[], null>({
            query: () => `/dispatch`,
            providesTags: [{ type: "Dispatch" as const, id: "LIST" }]
        }),


        getUserNotification: builder.query<NotificationType[], null>({
        query: () => `/orders/notifications`,
        providesTags: ["Notification"],
        }),


        deleteNotification: builder.mutation<NotificationType[], string>({
            query: (id) => ({
                url: `/orders/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),


        getOrders: builder.query<Order[], null>({
        query: () => `/orders`,
        providesTags: ["Order"],
        }),


        getOrderById: builder.query<Order, string>({
        query: (orderId) => `/orders/${orderId}`,
        providesTags: (_result, _error, id) => [{ type: "Order", id }],
        }),


        updateOrderStatus: builder.mutation<
        Order,
        { orderId: string; status: string }
        >({
            query: ({ orderId, status }) => ({
                url: `/orders/${orderId}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: "Order", id: orderId },
                "Order",
            ],
        }),


        assignDispatch: builder.mutation<
        {message: string, order: Order},
        { orderId: string; dispatchRiderId: string }
        >({
            query: ({ orderId, dispatchRiderId }) => ({
                url: `/dispatch/${orderId}`,
                method: "PATCH",
                body: { riderId: dispatchRiderId },
            }),
            invalidatesTags: (_result, _error, { orderId }) => [
                { type: "Order", id: orderId },
                "Order",
            ],
        }),

    }),
});


export const {
  useAddDispatchMutation,
  useGetRidersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersQuery,
  useGetUserNotificationQuery,
  useDeleteNotificationMutation,
  useAssignDispatchMutation
} = dispatchApi;