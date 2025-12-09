import React from 'react';
import { useAppSelector } from '../app/hooks';
import { ArrowLeft, LoaderCircle, ShoppingCart, UserCircleIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignOutMutation } from '../app/api/auth';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../app/authSlice';
import type { ToastProps } from '../utils/types';
import { useGetUserNotificationQuery } from '../app/api/orders';

interface PropsType {
  setToastProps?: React.Dispatch<React.SetStateAction<ToastProps>>
}

const Header: React.FC<PropsType> = ({ setToastProps }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signOut, { isLoading: signingout }] = useSignOutMutation();
  const { data: notifications } = useGetUserNotificationQuery(null);
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();
  const pathname = location.pathname;
  const arrowLeftArray = ["/kitchen", "/kitchen/add", "/orders", "/dispatch", "editprofile"];

  const handleSignOut = async () => {
    try{
      const response = await signOut({}).unwrap();
      if(response.message){
        dispatch(clearCredentials());
        navigate("/signin");
      }
    }catch(err){
      if(err && typeof err === "object" && "data" in err){
        const e = err as { data: { message: string } };
        if(setToastProps){
          setToastProps({ message: e.data.message, timeout: 5000, isError: true });
        }
      }
    }
  }

  return (
    <header className='fixed left-0 right-0 h-13 bg-white flex items-center justify-between px-4 shadow-sm'>
        <div className='flex items-center gap-1'>
            {(arrowLeftArray.includes(pathname) || arrowLeftArray.includes(pathname.split("/")[1])) ? <div onClick={() => navigate(-1)} ><ArrowLeft size={17} /></div> : <img src="/icon.png" onClick={() => navigate("/")} alt="cck-icon" title='CampusCloudKitchen Icon' className='w-10 cursor-pointer' />}
            <h1 className='text-[0.75rem] font-bold'>Campus Cloud Kitchen</h1>        
        </div>
        {!user ? <Link to={"/signin"} className="text-[0.75rem] cursor-pointer hover:opacity-90 transition-opacity px-2 py-1.5 bg-pri rounded-md text-white font-bold flex justify-center items-center">{signingout ? <LoaderCircle size={16} className='animate-spin' /> : "Signin"}</Link> : <div>
          {pathname.includes("profile") ? <button onClick={handleSignOut} className="text-[0.75rem] cursor-pointer hover:opacity-90 transition-opacity px-2 py-1.5 bg-red-500 rounded-md text-white font-bold flex justify-center items-center">{signingout ? <LoaderCircle size={16} className='animate-spin' /> : "Signout"}</button> : <div className='flex items-center gap-2'>
            {(!pathname.includes("cart") && user?.role !== "DISPATCH") && <Link to={`/cart`}> <ShoppingCart />
            </Link>}
            <Link to={`/profile/${user?.id}`} className='relative'>
              {user?.profileUrl ? <img src={user.profileUrl} className='w-10 aspect-square rounded-full border border-gray-300 object-cover object-top' alt="" /> : <UserCircleIcon />}
              {(notifications && notifications.length > 0) && <div className='absolute -top-1 -right-1 text-[0.7rem] bg-red-600 px-1 text-white rounded-full'>{notifications?.length}</div>}
            </Link>
          </div>}
        </div>}
    </header>
  )
}

export default Header;