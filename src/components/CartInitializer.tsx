import { useEffect } from "react";
import { useGetCartQuery } from "../app/api/cart";
import { useDispatch } from "react-redux";
import { setCartFromServer } from "../app/cartSlice";

const CartInitializer = () => {
  const dispatch = useDispatch();
  const response = useGetCartQuery(null);

  useEffect(() => {
    if (response.isSuccess && response.data) {
      console.log("Successfully fetched cart!");
      dispatch(setCartFromServer(response.data));
    }
  }, [dispatch, response]);

  return null;
};

export default CartInitializer;
