import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Navigate, Outlet } from 'react-router-dom';
import Splash from './Splash';

const ProtectedRoutes: React.FC = () => {
    const { token, isAuthLoading } = useAppSelector(state => state.auth);
    if(isAuthLoading) return <Splash />;
    return token ? <Outlet /> : <Navigate to={"/signin"} replace />
}

export default ProtectedRoutes;