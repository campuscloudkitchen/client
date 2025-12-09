import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { clearLocalCart, removeFromCartLocal, updateCartQuantityLocal } from "../app/cartSlice";
import { useSyncCartMutation } from "../app/api/cart";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import type { FoodType, OrderFormData, ToastProps } from "../utils/types";
import Header from "../components/Header";
import { orderValidationRules, type OrderValidationErrors } from "../utils/validationRules";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../app/api/orders";
import Toast from "../components/Toast";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [formData, setFormData] = useState<OrderFormData>({ deliveryAddress: "", phoneNumber: "" });
  const [validationErrors, setValidationErrors] = useState<OrderValidationErrors>({ deliveryAddress: null, phoneNumber: null });
  const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

  const [syncCart] = useSyncCartMutation();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if(name === "photo" && files){
      setFormData(prev => ({...prev, photo: files[0] as Blob}));
      setValidationErrors(prev => ({...prev, [name]: null}));
    } else {
      setValidationErrors(prev => ({...prev, [name]: null}));
      setFormData(prev => ({ ...prev, [name]: value })); }            
    }

  const handleIncrease = (id: string) => {
    dispatch(updateCartQuantityLocal({ id, type: "add", quantity: 1 }));
    if (userId) syncCart({ userId, cart: [...cartItems.map(item => 
      id === item.id ? ({ ...item, quantity: item.quantity + 1 }) : item
    )] });
  };

  const handleDecrease = (id: string) => {
    dispatch(updateCartQuantityLocal({ id, type: "minus", quantity: 1 }));
    if (userId) syncCart({ userId, cart: [...cartItems.map(item => 
      id === item.id ? ({ ...item, quantity: item.quantity - 1 }) : item
    )] });
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCartLocal(id));
    if (userId) syncCart({ userId, cart: [...cartItems.filter(item => item.id !== id)] });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.food as FoodType).price * item.quantity,
    0
  );

  const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      const errors = orderValidationRules(formData);
      setValidationErrors(errors)
      if(Object.values(errors).filter(value => value !== null).length > 0) return
      const body = {
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: formData.phoneNumber,       
      }

      try{
          const response = await createOrder(body).unwrap();
          if(response.id) {
              dispatch(clearLocalCart());
              navigate("/kitchen")
          }
      }catch(err){
          if(err && typeof err === "object" && "data" in err){
              const e = err as { data: { message: string } };
              setToastProps({ message: e.data.message, timeout: 5000, isError: true });
          }
      }
  }

  return (
    <>
    <Header />
    <Toast toastProps={toastProps} setToastProps={setToastProps}/>
    {cartItems.length === 0 ? <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center">Your cart is empty!</div> : <div className="cart-container p-4 space-y-3 pt-17">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="cart-item flex items-center justify-between p-3 text-sm shadow-sm border border-gray-200 rounded"
        >
          <div className="flex items-center space-x-4">
            <img
              src={(item.food as FoodType).photoUrl as string | undefined}
              alt={(item.food as FoodType).name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{(item.food as FoodType).name}</p>
              <p className="text-gray-500">Le{(item.food as FoodType).price}</p>
              <p className="text-gray-400 text-sm">
                Stock: {(item.food as FoodType).quantity}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
            <button
              onClick={() => handleDecrease(item.id)}
              disabled={item.quantity <= 1}
              className="px-2 py-1 bg-gray-200 rounded disabled:text-gray-300"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => handleIncrease(item.id)}
              disabled={item.quantity >= (item.food as FoodType).quantity}
              className="px-2 py-1 bg-gray-200 rounded disabled:text-gray-300"
            >
              +
            </button></div>
            <button
              onClick={() => handleRemove(item.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="total-price font-bold text-sm text-right">
        Total: Le{totalPrice}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="w-full">
            <label htmlFor='deliveryAddress' className='offscreen'>Delivery Address</label>
            <input type="text" name='deliveryAddress' className='input-field' placeholder='Delivery Address' value={formData.deliveryAddress} onChange={handleInputChange} />
            {validationErrors.deliveryAddress && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.deliveryAddress}</p>}
        </div>        
        <div className="w-full">
            <label htmlFor='phoneNumber' className='offscreen'>Phone Number</label>
            <input type="text" name='phoneNumber' className='input-field' placeholder='Phone Number' value={formData.phoneNumber} onChange={handleInputChange} />
            {validationErrors.phoneNumber && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.phoneNumber}</p>}
        </div> 
        <button disabled={creatingOrder} className="bg-pri hover:opacity-90 transition-all opacity-80 w-full p-2.5 rounded-md text-sm font-bold cursor-pointer text-white disabled:bg-gray-400">
          {creatingOrder ? "Placing Order..." : "Place Order"}
        </button>       
      </form>
    </div>}
    </>
  );
};

export default Cart;
