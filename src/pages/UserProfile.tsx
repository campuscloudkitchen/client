import React from 'react';
import Header from '../components/Header';
import { useAppSelector } from '../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { CookingPot, Motorbike, NotebookPen, UserCircleIcon } from 'lucide-react';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);

    return (
        <>
            <Header />
            <main className='fixed top-13 bottom-0 left-0 right-0 flex flex-col justify-start py-5 items-center px-10 text-sm gap-2'>
                <div className='flex flex-col items-center'>
                    {<Link to={`/profile/${user?.id}`}>
                    {user?.profileUrl ? <img src={user.profileUrl} alt="" /> : <UserCircleIcon size={90} />}
                    </Link>}
                    <div className='flex flex-col items-center w-full'>
                        <h2 className='font-extrabold'>{user?.firstname} {user?.lastname}</h2>
                        <p>{user?.email}</p>
                        <Link to={`/editprofile/${user?.id}`} className='bg-pri py-1.5 px-2.5 text-white font-bold rounded-md mt-1.5 cursor-pointer hover:opacity-90 transition-opacity'>Edit Profile</Link>
                    </div>
                </div>
                {user?.role === "ADMIN" && <div className='w-full rounded-lg flex gap-3'>
                    <div onClick={() => navigate(`/kitchen`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <CookingPot className='text-pri'/>
                        <p>Kitchen</p>
                    </div>
                    <div onClick={() => navigate(`/orders`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <NotebookPen className='text-pri'/>
                        <p>Orders</p>
                    </div>
                    <div onClick={() => navigate(`/kitchen`)} className='w-full py-2.5 px-2.5 text-black cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200 flex flex-col items-center rounded-lg gap-1'>
                        <Motorbike className='text-pri'/>
                        <p>Dispatch</p>
                    </div>
                </div>}
            </main>
        </>
    )
}

export default UserProfile