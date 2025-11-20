import React from 'react';
import { useAppSelector } from '../app/hooks';
import { ArrowLeft, LoaderCircle, ShoppingCart, UserCircleIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignOutMutation } from '../app/api/auth';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../app/authSlice';
import type { ToastProps } from '../utils/types';

interface PropsType {
  setToastProps?: React.Dispatch<React.SetStateAction<ToastProps>>
}

const Header: React.FC<PropsType> = ({ setToastProps }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signOut, { isLoading: signingout }] = useSignOutMutation();
  const user = useAppSelector(state => state.auth.user);
  const location = useLocation();
  const pathname = location.pathname;
  const arrowLeftArray = ["/kitchen", "/kitchen/add", "/orders", "/dispatch"];

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
            {arrowLeftArray.includes(pathname) ? <div onClick={() => navigate(-1)} ><ArrowLeft size={17} /></div> : <img src="/icon.png" onClick={() => navigate("/")} alt="cck-icon" title='CampusCloudKitchen Icon' className='w-10' />}
            <h1 className='text-[0.75rem] font-bold'>Campus Cloud Kitchen</h1>        
        </div>
        <div>
          {pathname.includes("profile") ? <button onClick={handleSignOut} className="text-[0.75rem] cursor-pointer hover:opacity-90 transition-opacity px-2 py-1.5 bg-red-500 rounded-md text-white font-bold flex justify-center items-center">{signingout ? <LoaderCircle size={16} className='animate-spin' /> : "Signout"}</button> : <div className='flex gap-2'>
            {!pathname.includes("cart") && <Link to={`/cart`}>
              {user?.profileUrl ? <img src={user.profileUrl} alt="" /> : <ShoppingCart />}
            </Link>}
            <Link to={`/profile/${user?.id}`}>
              {user?.profileUrl ? <img src={user.profileUrl} alt="" /> : <UserCircleIcon />}
            </Link>
          </div>}
        </div>
    </header>
  )
}

export default Header;