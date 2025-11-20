import { createSlice } from "@reduxjs/toolkit";
import type { SigninReturnType } from "../utils/types";

const initialState: SigninReturnType = {
    token: null,
    user: null,
    isAuthLoading: true,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.token = payload.token;
            state.user = payload.user;
            state.isAuthLoading = false;
        },
        clearCredentials: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthLoading = false;            
        },
    },
});


export const authReducer = authSlice.reducer;
export const { setCredentials, clearCredentials, } = authSlice.actions;