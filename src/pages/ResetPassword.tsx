import { Eye, EyeOff } from 'lucide-react';
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { PasswordResetFormData, ToastProps } from '../utils/types';
import { resetPasswordValidationRules, type ResetPasswordValidationErrors } from '../utils/validationRules';
import { useResetPasswordMutation } from '../app/api/auth';
import Toast from '../components/Toast';


const ResetPassword: React.FC = () => {
    const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [showCPwd, setShowCPwd] = useState<boolean>(false);
    const [formData, setFormData] = useState<PasswordResetFormData>({ password: "", confirmpassword: "" });
    const [validationErrors, setValidationErrors] = useState<ResetPasswordValidationErrors>({ password: null, confirmpassword: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const [params, setParams] = useSearchParams()
    console.log(params.get("token"))

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); 
        }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = resetPasswordValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return 
        try{
            const response = await resetPassword({password: formData.password, token: params.get("token") }).unwrap();
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
                <h1 className='text-[0.75rem] mb-2'>Submit new password to reset!</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2">
                <div className="w-full">
                    <div className='w-full relative'>
                        <label htmlFor='password' className='offscreen'>Password</label>
                        <input type={showPwd ? "text" : "password"} name='password' className='input-field' placeholder='Password' value={formData.password} onChange={handleInputChange} />
                        {showPwd ? <EyeOff  onClick={() => setShowPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                    </div> 
                    {validationErrors.password && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.password}</p>}                  
                </div>
                <div className="w-full">
                    <div className='w-full relative'>
                        <label htmlFor='confirmpassword' className='offscreen'>Confirm Password</label>
                        <input type={showCPwd ? "text" : "password"} name='confirmpassword' className='input-field' placeholder='Confirm Password' value={formData.confirmpassword} onChange={handleInputChange} />
                        {showCPwd ? <EyeOff  onClick={() => setShowCPwd(false)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/> : <Eye onClick={() => setShowCPwd(true)} size={20} className='absolute top-1/2 -translate-y-1/2 right-3'/>} 
                    </div> 
                    {validationErrors.confirmpassword && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.confirmpassword}</p>}                  
                </div>
                <button type='submit' className='bg-pri hover:opacity-90 opacity-80 w-full p-2.5 rounded-md text-sm font-bold text-white'>
                    {resetting ? "Resetting..." : "Reset Password"}
                </button>
            </form>
            <div className='text-[0.75rem] flex gap-1 mt-1'>
                <p>Remember Password? </p>
                <Link to={"/signin"} className='font-bold text-pri'>Signin</Link>
            </div>
        </main>
    );
}

export default ResetPassword;