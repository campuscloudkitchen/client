import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "../utils/types";

interface initType {
    cart: CartItem[] | []
}

const initialState: initType = {
    cart: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, { payload }) => {
            state.cart.push(payload);
        },
        removeFromCart: (state, { payload }) => {
            if(state.cart.length > payload - 1){
                state.cart.splice(payload, 1);            
            }
        }
    }
});


export const {
    addToCart, removeFromCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer; 