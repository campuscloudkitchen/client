import React, { useEffect, useState, type ChangeEvent } from 'react';
import Header from '../components/Header';
import { useGetFoodsQuery } from '../app/api/food';
import { CircleSlash2, Search } from 'lucide-react';
import FoodExerpt from '../components/FoodExerpt';
import type { FoodType } from '../utils/types';
import Loader from '../components/Loader';
import { useAppSelector } from '../app/hooks';
import { useGetDispatchOrderQuery } from '../app/api/orders';
import { skipToken } from '@reduxjs/toolkit/query';
import OrderExcerpt from '../components/OrderExcerpt';

const Home: React.FC = () => {
    const { data, isLoading } = useGetFoodsQuery(null);
    const [foods, setFoods] = useState<FoodType[]>(data ?? []);
    const user = useAppSelector(state => state.auth.user);
    const { data: dispatchOrders } = useGetDispatchOrderQuery(user ? user.id : skipToken);
    console.log(dispatchOrders);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(data){
            setFoods(data?.filter(food => food.name.toLowerCase().includes(e.target.value.toLowerCase())));         
        }
    }
    
    useEffect(() => {
        if(data) setFoods(data);
    }, [data]);
    
    return (
        <>
            <Header />
            {user?.role !== "DISPATCH" && <main className='w-full min-h-screen px-4 pt-16 max-w-6xl mx-auto'>
                <div className='w-full relative'>
                    <input type="text" className='input-field' placeholder='Search' onChange={handleChange} />
                    <Search size={18} className='text-[#c4c4c4] absolute right-2 top-1/2 -translate-y-1/2' />
                </div>
                {isLoading ? <Loader /> : foods.length < 1 ? <div className='flex flex-col items-center text-gray-400 py-2 '><CircleSlash2 size={17} /><p className='text-center text-[0.7rem] font-bold'>Nothing in the menu for now!</p></div> : foods && <div className='pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                    {foods.map(food => <FoodExerpt key={food.id} food={food} />)}
                </div>}
            </main>}
            {user?.role === "DISPATCH" && <main className='w-full min-h-screen px-4 pt-16 max-w-6xl mx-auto'>
                <h2 className='font-bold mb-2 text-sm'>Orders</h2>
                {isLoading ? <Loader /> : (dispatchOrders ?? []).length < 1 ? <div className='flex flex-col items-center text-gray-400 py-2 '><CircleSlash2 size={17} /><p className='text-center text-[0.7rem] font-bold'>You have no order for now!</p></div> : dispatchOrders && <div className='flex flex-col gap-2'>
                    {dispatchOrders.map(order => <OrderExcerpt order={order} />)}
                </div>}
            </main>}
        </>
    )
}

export default Home;