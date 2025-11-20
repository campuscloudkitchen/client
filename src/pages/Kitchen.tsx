import React, { useEffect, useState, type ChangeEvent } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useGetFoodsQuery } from '../app/api/food';
import type { FoodType } from '../utils/types';
import FoodExerpt from '../components/FoodExerpt';
import Loader from '../components/Loader';

const Kitchen: React.FC = () => {

    const { data, isLoading } = useGetFoodsQuery(null);
    const [foods, setFoods] = useState<FoodType[]>(data ?? []);
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
            <main className='pt-16 px-4 min-h-screen flex flex-col max-w-6xl mx-auto'>
                <div className='w-full relative'>
                    <input type="text" className='input-field' placeholder='Search' onChange={handleChange} />
                    <Search size={18} className='text-[#c4c4c4] absolute right-2 top-1/2 -translate-y-1/2' />
                </div>
                {isLoading ? <Loader /> : foods && <div className='pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                    {foods.map(food => <FoodExerpt food={food} />)}
                </div>}
                <Link to={"/kitchen/add"} className='bg-pri fixed p-4 hover:opacity-90 transition-opacity cursor-pointer rounded-full bottom-2 left-1/2 -translate-x-1/2'>
                    <Plus className='text-white' />
                </Link>
            </main>
        </>
    )
}

export default Kitchen;