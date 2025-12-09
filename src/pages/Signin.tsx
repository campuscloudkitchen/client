import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { SigninFormData, ToastProps } from '../utils/types';
import { signInValidationRules, type SignInValidationErrors } from '../utils/validationRules';
import { setCredentials } from '../app/authSlice';
import { useSignInMutation, useVerifyEmailQuery } from '../app/api/auth';
import { useAppDispatch } from '../app/hooks';
import Toast from '../components/Toast';
import { skipToken } from '@reduxjs/toolkit/query';


const Signin: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [signIn, { isLoading: signingIn }] = useSignInMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [formData, setFormData] = useState<SigninFormData>({ email: "", password: "" });
    const [validationErrors, setValidationErrors] = useState<SignInValidationErrors>({ email: null, password: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { data, isLoading: verifyingEmail } = useVerifyEmailQuery(token ?? skipToken);
    useEffect(() => {
        if(data && data.message){
            setToastProps({ message: data.message, timeout: 5000, isError: false });
        }
    }, [data]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = signInValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return
        try{
            const response = await signIn(formData).unwrap();
            console.log(response)
            if(response.token) {
                dispatch(setCredentials(response));
                navigate("/");}
            if(response.message) setToastProps({ message: response.message, timeout: 5000, isError: false });
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }}

    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center px-10'>
            {verifyingEmail && <div className={`text-[0.75rem] border p-3 rounded-md text-green-600 border-green-600 animate-bounce fixed top-5 flex justify-center items-center max-w-sm mx-auto`}>
            Verifying your email...
        </div>}
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            <div className='flex flex-col items-center gap-1'>
                <img src="/logo.png" alt="" className='w-25' />
                <h1 className='text-[0.75rem] mb-2'>Signin to access your account!</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2 max-w-[300px]">
                <div className="w-full">
                    <label htmlFor='email' className='offscreen'>Email</label>
                    <input type="text" name='email' className='input-field' placeholder='Email' value={formData.email} onChange={handleInputChange} />
                    {validationErrors.email && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.email}</p>}
                </div>
                <div className="w-full">
                    <div className='w-full relative'>
                        <label htmlFor='password' className='offscreen'>Password</label>
                        <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                        {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                    </div> 
                    {validationErrors.password && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.password}</p>}                  
                </div>
                <button type='submit' className='bg-pri cursor-pointer hover:opacity-90 transition-all opacity-80 w-full p-2.5 rounded-md text-sm font-bold text-white'>
                    {signingIn ? "Signingin..." : "Signin"}
                </button>
            </form>
            <Link to={"/forgotpassword"} className='text-[0.75rem] underline font-bold text-pri mt-2' >Forgot Password?</Link>
            <div className='text-[0.75rem] flex gap-1 mt-1'>
                <p>Already have an account? </p>
                <Link to={"/signup"} className='font-bold text-pri'>Signup</Link>
            </div>
        </main>
    );
}

export default Signin;