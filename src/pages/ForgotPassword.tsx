import React, { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordValidationRules } from '../utils/validationRules';
import { useForgotPasswordMutation } from '../app/api/auth';
import Toast from '../components/Toast';
import type { ToastProps } from '../utils/types';


const ForgotPassword: React.FC = () => {
    const [forgotPassword, { isLoading: submitting }] = useForgotPasswordMutation();
    const [email, setEmail] = useState<string>("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const error = forgotPasswordValidationRules(email);
        setValidationError(error)
        if(error) return;
        try{
            const response = await forgotPassword({ email }).unwrap();
            if(response.message) setToastProps({ message: response.message, timeout: 5000, isError: false });
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
        }

    return (
        <main className='fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center px-10'>
            <Toast toastProps={toastProps} setToastProps={setToastProps}/>
            <div className='flex flex-col items-center gap-1'>
                <img src="/logo.png" alt="" className='w-25' />
                <h1 className='text-[0.75rem] mb-2'>Submit your email to reset your password!</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2">
                <div className="w-full">
                    <label htmlFor='email' className='offscreen'>Email</label>
                    <input type="text" name='email' className='input-field' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    {validationError && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationError}</p>}
                </div>
                <button type='submit' className='bg-pri hover:opacity-90 opacity-80 w-full p-2.5 rounded-md text-sm font-bold text-white'>
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </form>
            <div className='text-[0.75rem] flex gap-1 mt-2'>
                <p>Remember password? </p>
                <Link to={"/signin"} className='font-bold text-pri'>Signin</Link>
            </div>
        </main>
    );
}

export default ForgotPassword;