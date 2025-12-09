import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../components/Header';
import type { AddDispatchFormData, ToastProps } from '../utils/types';
import { addDispatchValidationRules, type AddDispatchValidationErrors } from '../utils/validationRules';
import Toast from '../components/Toast';
import { useAddDispatchMutation } from '../app/api/dispatch';
import { useNavigate } from 'react-router-dom';

const AddDispatch: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AddDispatchFormData>({ firstname: "", lastname: "", email: "" });
    const [validationErrors, setValidationErrors] = useState<AddDispatchValidationErrors>({ lastname: null, firstname: null, email: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });
    const [addDispatch, { isLoading: addingDispatch }] = useAddDispatchMutation()

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValidationErrors(prev => ({...prev, [name]: null}));
        setFormData(prev => ({ ...prev, [name]: value })); }            


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errors = addDispatchValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return
        try{
            const response = await addDispatch(formData).unwrap();
            if(response.message){
                setToastProps({ message: response.message, timeout: 5000, isError: false });
                setTimeout(() => {
                    navigate("/dispatch");
                }, 5000);
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }

    return (
        <>
            <Header />
            <main className='pt-13 min-h-screen flex flex-col justify-center items-center'>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-full gap-2 max-w-[300px]'>
                    <h2 className='text-sm font-bold'>Add Dispatch</h2>
                    <div className="w-full">
                        <label htmlFor='firstname' className='offscreen'>First name</label>
                        <input type="text" name='firstname' className='input-field' placeholder='First name' value={formData.firstname} onChange={handleInputChange} />
                        {validationErrors.firstname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.firstname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='lastname' className='offscreen'>Last name</label>
                        <input type="text" name='lastname' className='input-field' placeholder='Last name' value={formData.lastname} onChange={handleInputChange} />
                        {validationErrors.lastname && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.lastname}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='email' className='offscreen'>Email</label>
                        <input type="email" name='email' className='input-field' placeholder='Email' value={formData.email} onChange={handleInputChange} />
                        {validationErrors.email && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.email}</p>}
                    </div>
                    <button type='submit' disabled={addingDispatch} className='bg-pri hover:opacity-90 transition-all opacity-80 w-full p-2.5 rounded-md text-sm font-bold cursor-pointer text-white disabled:bg-gray-400'>
                        {addingDispatch ? "Adding..." : "Add Dispatch"}
                    </button>
                </form>            
            </main>        
        </>
    )
}

export default AddDispatch;