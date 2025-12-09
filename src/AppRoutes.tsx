import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Kitchen from './pages/Kitchen';
import Dispatch from './pages/Dispatch';
import Orders from './pages/Orders';
import AddFood from './pages/AddFood';
import UpdateFood from './pages/UpdateFood';
import Cart from './pages/Cart';
import AdminOrders from './pages/AdminOrders';
import AddDispatch from './pages/AddDispatch';
import EditProfile from './pages/EditProfile';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path='/signin' element={<Signin />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/resetpassword' element={<ResetPassword />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/updatefood/:id' element={<UpdateFood />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/kitchen'>
                        <Route index element={<Kitchen />} />
                        <Route path='/kitchen/add' element={<AddFood />} />
                    </Route>
                    <Route path='/dispatch' element={<Dispatch />} />
                    <Route path='/dispatch/add' element={<AddDispatch />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/orders/admin' element={<AdminOrders />} />
                    <Route path='/profile/:id' element={<UserProfile />} />
                    <Route path='/editprofile/:id' element={<EditProfile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default AppRoutes;