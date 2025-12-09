import React, { useState } from 'react'
import type { ToastProps, User } from '../utils/types'
import { LoaderCircle, UserCircle } from 'lucide-react';
import Toast from './Toast';
import { useDeleteUserMutation } from '../app/api/user';

const DispatchExcerpt: React.FC<{ dispatchRider: User }> = ({ dispatchRider }) => {
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    const [ deleteDispatch, { isLoading } ] = useDeleteUserMutation();
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const handleDelete = async () => {
        try{
            await deleteDispatch(dispatchRider.id);
            if(!isLoading) setShowDialog(false)
        } catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }            
        }
    }
    
    return (
        <div className='flex gap-2 justify-between items-center w-full p-2.5 border border-gray-200 bg-gray-100 shadow-xs rounded-xl'>
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            <div className='flex gap-2 items-center'>
                <UserCircle size={30}/>
                <div className='text-sm'>
                    <p className='font-bold'>{dispatchRider.firstname} {dispatchRider.lastname}</p>
                    <p>{dispatchRider.email}</p>
                </div>
            </div>
            <button onClick={() => setShowDialog(true)} className='text-sm bg-red-600 text-white p-2 rounded-lg cursor-pointer'>Delete</button>
            {showDialog && <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/70 z-20 flex justify-center items-center'>
                <div className='bg-white p-4 max-w-[300px] rounded-xl flex flex-col items-center gap-1'>
                    <p className='text-center text-sm'>Are you sure you want to remove <span className='font-bold'>{dispatchRider.firstname} {dispatchRider.lastname}</span> as a dispatch rider?</p>
                    <div className='flex gap-2'>
                        <button onClick={() => setShowDialog(false)} className='text-sm bg-pri text-white p-2 rounded-lg cursor-pointer w-15'>No</button>
                        <button onClick={handleDelete} className='text-sm bg-red-600 text-white p-2 rounded-lg cursor-pointer w-15 flex justify-center items-center'>{isLoading ? <LoaderCircle className='animate-spin' size={17} /> : "Yes"}</button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default DispatchExcerpt