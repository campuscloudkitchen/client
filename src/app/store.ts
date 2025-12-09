import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { cartReducer } from "./cartSlice";
import api from "./apiSlice";
import { cartSyncMiddleware } from "./middlewares/cartSyncMiddleware";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat(cartSyncMiddleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;