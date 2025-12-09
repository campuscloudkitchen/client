import type { CartItem } from "../../utils/types";
import api from "../apiSlice";


const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<CartItem[], null>({
            query: () => "/carts",
            providesTags: (result) => result ? [
                ...result.map(cartItem => ({type: "Cart" as const, id: cartItem.id})), { type: "Cart" as const, id: "LIST" }
            ] : [{ type: "Cart" as const, id: "LIST" }]
        }),
        addToCart: builder.mutation<CartItem, { userId: string, foodId: string }>({
            query: (body) => ({
                url: "/carts",
                method: "POST",
                body
            }),
            invalidatesTags: (result) => result ? [
                {type: "Cart" as const, id: result.id}, { type: "Cart" as const, id: "LIST" }
            ] : [{ type: "Cart" as const, id: "LIST" }]
        }),
        removeFromCart: builder.mutation<{message: string}, string>({
            query: (id) => ({
                url: `/carts/${id}`,
                method: "DELETE",
            }),
        }),
        syncCart: builder.mutation<void, { userId: string; cart: CartItem[] }>({
            query: ({ userId, cart }) => ({
                url: "/carts/sync",
                method: "POST",
                body: { userId, cart }
            }),
            invalidatesTags: ["Cart"]
        }),
    }),
});


export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useSyncCartMutation
} = cartApi;

export default cartApi;