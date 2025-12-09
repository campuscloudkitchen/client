import React from 'react';
import Header from '../components/Header';
import { useGetOrdersQuery } from '../app/api/orders';
import Loader from '../components/Loader';
import { CircleSlash2 } from 'lucide-react';
import OrderExcerpt from '../components/OrderExcerpt';

const AdminOrders: React.FC = () => {
    const { data, isLoading } = useGetOrdersQuery(null);
    console.log(data)

    return (
        <>
            <Header />
            <main className='w-full min-h-screen px-4 pt-16 max-w-6xl mx-auto'>
                {isLoading ? <Loader /> : (data ?? []).length < 1 ? <div className='flex flex-col items-center text-gray-400 py-2 '><CircleSlash2 size={17} /><p className='text-center text-[0.7rem] font-bold'>You have no order for now!</p></div> : data && <div className='flex flex-col gap-4'>
                    {data.map(order => <OrderExcerpt order={order} />)}
                </div>}
            </main>            
        </>
    )
}

export default AdminOrders;