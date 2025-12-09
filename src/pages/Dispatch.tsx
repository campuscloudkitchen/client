import React, { useEffect, useState, type ChangeEvent } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { CircleSlash2, Plus, Search } from 'lucide-react';
import type { User } from '../utils/types';
import Loader from '../components/Loader';
import { useGetRidersQuery } from '../app/api/dispatch';
import DispatchExcerpt from '../components/DispatchExcerpt';

const Dispatch: React.FC = () => {

    const { data, isLoading } = useGetRidersQuery(null);
    const [riders, setRiders] = useState<User[]>(data ?? []);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(data){
            setRiders(data?.filter(rider => (rider.firstname + rider.lastname).toLowerCase().includes(e.target.value.toLowerCase())));         
        }
    }
    
    useEffect(() => {
        if(data) setRiders(data);
    }, [data]);

    return (
        <>
            <Header />
            <main className='pt-16 px-4 min-h-screen flex flex-col max-w-6xl mx-auto'>
                <div className='w-full relative'>
                    <input type="text" className='input-field' placeholder='Search' onChange={handleChange} />
                    <Search size={18} className='text-[#c4c4c4] absolute right-2 top-1/2 -translate-y-1/2' />
                </div>
                {isLoading ? <Loader /> : riders.length < 1 ? <div className='flex flex-col items-center text-gray-400 py-2 '><CircleSlash2 size={17} /><p className='text-center text-[0.7rem] font-bold'>You have no dispatch rider!</p></div> : riders && <div className='w-full pt-2'>
                    {riders.map(rider => <DispatchExcerpt dispatchRider={rider} />)}
                </div>}
                <Link to={"/dispatch/add"} className='bg-pri fixed p-4 hover:opacity-90 transition-opacity cursor-pointer rounded-full bottom-2 left-1/2 -translate-x-1/2'>
                    <Plus className='text-white' />
                </Link>
            </main>
        </>
    )
}

export default Dispatch;