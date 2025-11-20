import React, { useEffect, useState, type ChangeEvent } from 'react';
import Header from '../components/Header';
import { useGetFoodsQuery } from '../app/api/food';
import { Search } from 'lucide-react';
import FoodExerpt from '../components/FoodExerpt';
import type { FoodType } from '../utils/types';
import Loader from '../components/Loader';

const Home: React.FC = () => {
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
            <main className='w-full min-h-screen px-4 pt-16 max-w-6xl mx-auto'>
                <div className='w-full relative'>
                    <input type="text" className='input-field' placeholder='Search' onChange={handleChange} />
                    <Search size={18} className='text-[#c4c4c4] absolute right-2 top-1/2 -translate-y-1/2' />
                </div>
                {isLoading ? <Loader /> : foods && <div className='pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                    {foods.map(food => <FoodExerpt food={food} />)}
                </div>}
            </main>
        </>
    )
}

export default Home;