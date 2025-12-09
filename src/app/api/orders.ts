import type { NotificationType, Order } from "../../utils/types";
import api from "../apiSlice";


export const orderApi = api.injectEndpoints({

  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, {deliveryAddress: string, phoneNumber: string}>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),


    getUserOrders: builder.query<Order[], null>({
      query: () => `/orders/user`,
      providesTags: ["Order"],
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


    getDispatchOrder: builder.query<Order[], string>({
      query: (riderId) => `/orders/dispatch/${riderId}`,
      providesTags: [{ type: "Order", id: "LIST" }],
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

  }),
});


export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersQuery,
  useGetUserNotificationQuery,
  useDeleteNotificationMutation,
  useGetDispatchOrderQuery
} = orderApi;