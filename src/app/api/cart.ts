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
        })
    }),
});


export const {
    useGetCartQuery,
    useAddToCartMutation
} = cartApi