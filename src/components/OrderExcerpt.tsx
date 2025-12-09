import React, { useState } from 'react';
import type { Order, ToastProps } from '../utils/types';
import QrCode from "react-qr-code";
import { useAppSelector } from '../app/hooks';
import { useUpdateOrderStatusMutation } from '../app/api/orders';
import Toast from './Toast';
import { useAssignDispatchMutation, useGetRidersQuery } from '../app/api/dispatch';
import { LoaderCircle } from 'lucide-react';

const OrderExcerpt: React.FC<{ order: Order }> = ({ order }) => {
    const user = useAppSelector(state => state.auth.user);
    const { data: dispatchRiders } = useGetRidersQuery(null);
    const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();
    const [assignDis, { isLoading: assigning }] = useAssignDispatchMutation();
    const [showDialog, setShowDialog] = useState(false);
    const [showDeliverDialog, setShowDeliverDialog] = useState(false);
    const [selectedRider, setSelectedRider] = useState<string>("");
    const [deliveryId, setDeliveryId] = useState<string>("");
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    console.log(order)
    
    const cancelOrder = async () => {
        try{
            await updateStatus({ orderId: order.id, status: "CANCELLED" }).unwrap();
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }
    
    const deliverOrder = async () => {
        try{
            await updateStatus({ orderId: deliveryId, status: "DELIVERED" }).unwrap();
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }

    const assignDispatch = async () => {
        if(!selectedRider) return;
        const body = { orderId: order.id, dispatchRiderId: selectedRider }
        try{
            const response = await assignDis(body).unwrap();
            if(response.order){
                setShowDialog(false);
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }
    return (
        <div className='w-full flex flex-col gap-2 shadow-xs rounded-lg border border-gray-200 p-3 bg-gray-100'>
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            {order.items.map(item => <div className='flex items-center justify-between w-full text-[0.8rem] gap-2 pb-2 border-gray-300 border-b'>
                <div className='flex items-center gap-2'>
                    <div>
                        <img src={item.food.photoUrl} className='aspect-square object-cover w-10 rounded-lg' />
                    </div>
                    <div>
                        <p className='font-bold'>{item.food.name}</p>
                        <p>Quantity: {item.quantity}</p>
                    </div>                    
                </div>
                <div>
                    <p>NLe {item.food.price * item.quantity}</p>
                </div>
            </div>)}
            <div className='flex flex-col items-center'>
                <p className='text-[0.8rem] font-bold text-center pb-1'>Total: NLe{order.totalAmount}</p>
                <div className='flex flex-col items-center text-[0.8rem]'>
                    {user?.role !== "DISPATCH" && <><QrCode value={order.id} size={100} />
                    <p className='text-center mt-1'>{order.id}</p></>}
                    <p>Phone Number: {order.phoneNumber}</p>
                    <p>Address: {order.deliveryAddress}</p>
                </div>
            </div>
            {(order.status === "PENDING" && user?.role === "USER") && <button onClick={() => setShowDeliverDialog(true)} className='text-[0.8rem] bg-gray-400 py-1.5 rounded-lg flex justify-center items-center text-white'>PENDING</button>} 
            {(order.status === "CONFIRMED" && user?.role === "DISPATCH") && <button onClick={() => setShowDeliverDialog(true)} className='text-[0.8rem] bg-pri py-1.5 rounded-lg flex justify-center items-center text-white font-bold'>Deliver</button>} 
            {(order.status === "DELIVERED") && <p className='text-[0.8rem] bg-green-600 py-1.5 rounded-lg flex justify-center items-center text-white font-bold'>DELIVERED</p>} 
            {(order.status === "CANCELLED" && user?.role !== "DISPATCH") && <p className='text-[0.8rem] bg-red-600 py-1.5 rounded-lg flex justify-center items-center text-white'>CANCELLED</p>} 
            {(order.status === "CONFIRMED" && user?.role !== "DISPATCH") && <p className='text-[0.8rem] bg-green-600 py-1.5 rounded-lg flex justify-center items-center text-white'>CONFIRMED</p>} 
            {(user?.role === "ADMIN" && order.status === "PENDING") && <div className={`bg-red-600 items-center justify-center w-full h-8 rounded-lg overflow-hidden flex text-[0.8rem] divide-x text-white`}>
                <><button onClick={cancelOrder} disabled={isLoading} className='flex-1 h-full cursor-pointer bg-red-600 disabled:bg-gray-400'>{isLoading ? "Cancelling..." : "Cancel"}</button>
                <button onClick={() => setShowDialog(true)} className='flex-1 h-full bg-pri cursor-pointer'>Dispatch</button></>
            </div>}
            {showDialog && <><div onClick={() => setShowDialog(false)} className='absolute top-0 bottom-0 left-0 right-0 cursor-pointer bg-black/80 z-20 flex justify-center items-center'></div>
            <div className='bg-white p-4 max-w-[300px] rounded-xl flex flex-col items-center gap-1 w-full fixed z-50 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
                <h2 className='text-sm font-bold'>Assign Dispatch</h2>
                <select value={selectedRider} onChange={(e) => setSelectedRider(e.target.value)} className='w-full bg-gray-100 p-2 text-[0.8rem] rounded-lg'>
                    <option value="" disabled>Select Dispatch</option>
                    {dispatchRiders?.map(rider => <option value={rider.id}>{rider.firstname} {rider.lastname}</option>)}
                </select>
                {!selectedRider && <p className='text-[0.8rem] text-red-600'>Please select a dispatch rider!</p>}
                <button onClick={assignDispatch} className='flex-1 rounded-xl w-full bg-pri text-white text-sm p-2 flex justify-center items-center cursor-pointer'>{assigning ? <LoaderCircle className='animate-spin' size={17} /> : "Assign"}</button>
            </div></>}
            {showDeliverDialog && <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/50 z-20 flex justify-center items-center'>
                <div className='bg-white p-4 max-w-[300px] rounded-xl flex flex-col items-center gap-1 w-full'>
                    <h2 className='text-sm font-bold'>Enter Order Id</h2>
                    <input type="text" value={deliveryId} onChange={(e) => setDeliveryId(e.target.value)} className='w-full p-2 text-[0.8rem] rounded-lg outline-none border border-gray-300 inset-shadow-xs'/>
                    <button onClick={deliverOrder} className='flex-1 rounded-xl w-full bg-pri text-white text-sm p-2 flex justify-center items-center cursor-pointer'>{isLoading ? <LoaderCircle className='animate-spin' size={17} /> : "Deliver"}</button>
                </div>
            </div>}
        </div>
    )
}

export default OrderExcerpt