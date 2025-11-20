import type { FoodType } from "../../utils/types";
import api from "../apiSlice";


const foodApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addFood: builder.mutation<FoodType, FormData>({
            query: (body) => ({
                url: "/foods",
                method: "POST",
                body,
            }),
            invalidatesTags: (result) => result ? [{ type: "Food" as const, id: result.id }, { type: "Food" as const, id: "LIST" }] : [{ type: "Food" as const, id: "LIST" }]
        }),
        getFoods: builder.query<FoodType[], null>({
            query: () => "/foods",
            providesTags: (result) => result ? [
                ...result.map(food => ({ type: "Food" as const, id: food.id })), { type: "Food" as const, id: "LIST" }
            ] : [{ type: "Food" as const, id: "LIST" }]
        }),
        getFood: builder.query<FoodType, string>({
            query: (id) => `/foods/${id}`,
            providesTags: (result) => result ? [
                {type: "Food" as const, id: result.id }, { type: "Food" as const, id: "LIST" }
            ] : [{ type: "Food" as const, id: "LIST" }]
        }),
        updateFood: builder.mutation<FoodType, {id: string, body: FormData}>({
            query: ({id, body}) => ({
                url: `/foods/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: (result) => result ? [
                {type: "Food" as const, id: result.id }, { type: "Food" as const, id: "LIST" }
            ] : [{ type: "Food" as const, id: "LIST" }]
        })
    }),
});

export const {
    useAddFoodMutation,
    useUpdateFoodMutation,
    useGetFoodsQuery,
    useGetFoodQuery
} = foodApi;