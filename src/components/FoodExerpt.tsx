import React from 'react';
import type { FoodType } from '../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAddToCartMutation } from '../app/api/cart';
import { LoaderCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCartLocal } from '../app/cartSlice';

const FoodExerpt: React.FC<{ food: FoodType }> = ({ food }) => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart.items);
  const alreadyInCart = cart.some(item => item.foodId === food.id) ?? false;
  const user = useAppSelector(state => state.auth.user);
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const handleAddToCart = async () => {
    if(!user?.id) {
      navigate("/signin")
      return};
    const body = { userId: user?.id ?? "", foodId: food.id }
    try{
      const res = await addToCart(body).unwrap();
      console.log(res);
      if(res.id) dispatch(addToCartLocal({ 
        id: res.id,
        userId: res.userId,
        foodId: res.foodId,
        food: res.food,
        quantity: res.quantity,
      }));
    }catch(err){
      console.log(err);
    }
  }

  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div key={food.id} className='flex flex-col text-sm border border-gray-400 rounded-lg overflow-hidden'>
        <div className='aspect-square'>
            <img src={food.photoUrl!} className='w-full aspect-square object-cover object-center' />
        </div>
        {food.quantity ? <div className='p-2 text-sm'>
            <p className='font-bold'>{food.name}</p>
            <div className='flex gap-1'><p>Le {food.price}</p> • <p className='text-gray-500'>In Stock</p></div>
            {pathname === "/kitchen" ? <button onClick={() => {navigate(`/updatefood/${food.id}`)}} className='bg-pri px-2 py-1 rounded-lg mt-1 font-bold text-white'>Update</button> : <button onClick={handleAddToCart} className={`bg-pri px-2 py-1 rounded-md mt-1 font-bold text-white flex justify-center items-center text-[0.8rem] disabled:bg-gray-400 w-23 cursor-pointer ${alreadyInCart && "w-27"}`} disabled={isLoading || alreadyInCart}>{isLoading ? <LoaderCircle className="animate-spin" size={17} /> : alreadyInCart ? "Added to cart" : "Add to cart"}</button>}
        </div> : <p className='text-gray-500'>Out of Stock</p>}
    </div>
  )
}

export default FoodExerpt;