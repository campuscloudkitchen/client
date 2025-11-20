import React from 'react';
import type { FoodType } from '../utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAddToCartMutation } from '../app/api/cart';
import { LoaderCircle } from 'lucide-react';
import { useAppSelector } from '../app/hooks';

const FoodExerpt: React.FC<{ food: FoodType }> = ({ food }) => {

  const cart = useAppSelector(state => state.cart.cart);
  const user = useAppSelector(state => state.auth.user);
  console.log(cart);
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const handleAddToCart = async () => {
    if(!user?.id) return;
    const body = { userId: user?.id ?? "", foodId: food.id }
    try{
      console.log(body)
      await addToCart(body);
    }catch(err){
      console.log(err);
    }
  }

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  return (
    <div className='flex flex-col text-sm border border-gray-400 rounded-lg overflow-hidden'>
        <div className='aspect-square'>
            <img src={food.photoUrl!} className='w-full aspect-square object-cover object-center' />
        </div>
        {food.quantity ? <div className='p-2 text-sm'>
            <p className='font-bold'>{food.name}</p>
            <div className='flex gap-1'><p>Le {food.price}</p> • <p className='text-gray-500'>In Stock</p></div>
            {pathname === "/kitchen" ? <button onClick={() => {navigate(`/updatefood/${food.id}`)}} className='bg-pri px-2 py-1 rounded-lg mt-1 font-bold text-white'>Update</button> : <button onClick={handleAddToCart} className='bg-pri px-2 py-1 rounded-lg mt-1 font-bold text-white flex justify-center items-center' disabled={isLoading}>{isLoading ? <LoaderCircle className="animate-spin" size={17} /> : "Add to cart"}</button>}
        </div> : <p className='text-gray-500'>Out of Stock</p>}
    </div>
  )
}

export default FoodExerpt;