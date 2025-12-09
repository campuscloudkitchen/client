import React, { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { fetchBaseQuery, type BaseQueryApi } from "@reduxjs/toolkit/query";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { clearCredentials, setCredentials } from "./app/authSlice";
import CartInitializer from "./components/CartInitializer";

const App: React.FC = () => {

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user)
  const cart = useAppSelector(state => state.cart.items)

  useEffect(() => {
    const baseQuery = fetchBaseQuery({
      baseUrl: "http://localhost:4321/api/v1",
      credentials: "include",
    });
    const refreshApp = async() => {
      const refreshResult = await baseQuery("/auth/refresh", {} as BaseQueryApi, {});
      if(refreshResult.data) {
        dispatch(setCredentials(refreshResult.data));
      }else {
        await baseQuery("/auth/signout", {} as BaseQueryApi, {});
        dispatch(clearCredentials());
      }
    }
    
    refreshApp();

  }, []);

  return (
    <>
      {(user && cart.length < 1) && <CartInitializer />}
      <AppRoutes />
    </>
  );
}

export default App;
