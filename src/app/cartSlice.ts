import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, UpdateQuantityPayload } from "../utils/types";

interface initType {
    items: CartItem[]
}

const initialState: initType = {
    items: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartFromServer: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },

        addToCartLocal: (state, action: PayloadAction<CartItem>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) item.quantity++;
            else state.items.push({ ...action.payload, quantity: 1 });
        },

        updateCartQuantityLocal: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const { id, type, quantity = 1 } = action.payload;
            const item = state.items.find((i) => i.id === id);
            if (!item) return;

            if (type === "add") {
                item.quantity += quantity;
            } else if (type === "minus") {
                item.quantity = Math.max(1, item.quantity - quantity);
            }
        },

        removeFromCartLocal: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload);
        },

        clearLocalCart: (state) => {
            state.items = []
        }
    }
});


export const {
    addToCartLocal, removeFromCartLocal, updateCartQuantityLocal, setCartFromServer, clearLocalCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer; 