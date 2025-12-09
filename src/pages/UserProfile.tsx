import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppSelector } from '../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { CookingPot, LoaderCircle, Motorbike, NotebookPen, UserCircleIcon, X } from 'lucide-react';
import { useDeleteNotificationMutation, useGetUserNotificationQuery } from '../app/api/orders';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import type { ToastProps } from '../utils/types';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const { data: notifications, isLoading: gettingNotification } = useGetUserNotificationQuery(null);
    const [deleteNoti, { isLoading: deletingNotification }] = useDeleteNotificationMutation();
    const [deletingId, setDeletingId] = useState<string>("");
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    const deleteNotification = async (id: string) => {
        try{
            await deleteNoti(id);
        } catch(err){
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
            <main className='fixed top-13 bottom-0 left-0 right-0 flex flex-col justify-start py-5 items-center px-10 text-sm gap-2'>
                <div className='flex flex-col items-center'>
                    {<Link to={`/profile/${user?.id}`}>
                    {user?.profileUrl ? <img src={user.profileUrl} alt="" className='w-20 aspect-square object-cover object-top rounded-full mb-2' /> : <UserCircleIcon size={90} />}
                    </Link>}
                    <div className='flex flex-col items-center w-full'>
                        <h2 className='font-extrabold'>{user?.firstname} {user?.lastname}</h2>
                        <p>{user?.email}</p>
                        {user?.role === "USER" && <Link to={"/orders"} className='bg-pri py-1.5 px-2.5 text-white font-bold rounded-md mt-1.5 cursor-pointer hover:opacity-90 transition-opacity'>Orders</Link>}
                        {<Link to={`/editprofile/${user?.id}`} className='bg-pri py-1.5 px-2.5 text-white font-bold rounded-md mt-1.5 cursor-pointer hover:opacity-90 transition-opacity'>Edit Profile</Link>}
                    </div>
                    {gettingNotification ?
                        <Loader /> : <div className='flex flex-col gap-2 mt-2'>
                        {notifications?.map(notification => <div className='w-full flex flex-col gap-1 border border-gray-200 shadow-xs rounded-xl text-[0.8rem] p-2 bg-gray-100'>
                            <div className='w-full flex justify-between'>
                               <p className='font-bold'>{notification.title}</p>
                               {(deletingId === notification.id && deletingNotification) ? <LoaderCircle size={17} className='animate-spin text-gray-300' /> : <X onClick={() => {deleteNotification(notification.id); setDeletingId(notification.id)}} size={17} className='text-gray-300 active:text-gray-500' /> }
                            </div>
                            <p className='text-gray-500'>{notification.reason}</p>
                        </div>)}
                    </div>}
                </div>
                {user?.role === "ADMIN" && <div className='w-full rounded-lg flex gap-3'>
                    <div onClick={() => navigate(`/kitchen`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <CookingPot className='text-pri'/>
                        <p>Kitchen</p>
                    </div>
                    <div onClick={() => navigate(`/orders/admin`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <NotebookPen className='text-pri'/>
                        <p>Orders</p>
                    </div>
                    <div onClick={() => navigate(`/dispatch`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <Motorbike className='text-pri'/>
                        <p>Dispatch</p>
                    </div>
                </div>}
            </main>
        </>
    )
}

export default UserProfile