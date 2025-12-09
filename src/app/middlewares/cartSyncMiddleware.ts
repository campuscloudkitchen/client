import type { Middleware } from "@reduxjs/toolkit";
import cartApi from "../api/cart";
import type { AppDispatch } from "../store";

export const cartSyncMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  const SYNC_ACTIONS = [
    "cart/addToCartLocal",
    "cart/increaseQtyLocal",
    "cart/decreaseQtyLocal",
    "cart/removeFromCartLocal",
  ];

  if (typeof action === "object" && action !== null && "type" in action) {
    if (SYNC_ACTIONS.includes(action.type as string)) {
      const state = storeAPI.getState();
      const userId = state.auth.user?.id;
      if (!userId) return result;

      const cart = state.cart.items;
      console.log(cart);
      (storeAPI.dispatch as AppDispatch)(
        cartApi.endpoints.syncCart.initiate({ userId, cart })
      );
    }
  }

  return result;
};
