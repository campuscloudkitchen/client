import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../components/Header';
import type { AddFoodFormData, ToastProps } from '../utils/types';
import { addFoodValidationRules, type AddFoodValidationErrors } from '../utils/validationRules';
import { UploadIcon, X } from 'lucide-react';
import { useAddFoodMutation } from '../app/api/food';
import Toast from '../components/Toast';

const AddFood: React.FC = () => {
    const [addFood, { isLoading: addingFood }] = useAddFoodMutation();
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [formData, setFormData] = useState<AddFoodFormData>({ name: "", price: "", quantity: "", photo: null });
    const [validationErrors, setValidationErrors] = useState<AddFoodValidationErrors>({ name: null, price: null, quantity: null, photo: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if(name === "photo" && files){
            setFormData(prev => ({...prev, photo: files[0] as Blob}));
            setPhotoUrl(URL.createObjectURL(files[0]));
            setValidationErrors(prev => ({...prev, [name]: null}));
        } else {
            setValidationErrors(prev => ({...prev, [name]: null}));
            setFormData(prev => ({ ...prev, [name]: value })); }            
        }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errors = addFoodValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return
        const body = new FormData();
        body.append("name", formData.name)
        body.append("price", formData.price)
        body.append("quantity", formData.quantity)
        body.append("photo", formData.photo as Blob);
        console.log(body.get("photo"))
        try{
            const response = await addFood(body).unwrap();
            if(response.id) {
                setPhotoUrl("")
                setFormData({ name: "", price: "", quantity: "", photo: null });
                setToastProps({ message: `Successfully added ${response.name}` , timeout: 5000, isError: false });
            }
        }catch(err){
            if(err && typeof err === "object" && "data" in err){
                const e = err as { data: { message: string } };
                setToastProps({ message: e.data.message, timeout: 5000, isError: true });
            }
        }
    }

    const removeImg = () => {
        setPhotoUrl("");
        setFormData(prev => ({...prev, photo: null}));
    }

    return (
        <>
            <Header />
            <main className='pt-13 min-h-screen flex flex-col justify-center items-center'>
                <Toast toastProps={toastProps} setToastProps={setToastProps}/>
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2 max-w-[300px]">
                    <div className="w-full flex flex-col gap-2 relative">
                        {photoUrl && <><div className='bg-white absolute top-2 right-2 w-5 h-5 flex justify-center items-center' onClick={removeImg}><X size={16} /></div>
                        <img src={photoUrl} alt='' className='w-full' /></>}
                        {!photoUrl && <label htmlFor='photo' className='text-sm bg-black text-white w-full flex justify-center gap-1 py-2 rounded-md'>
                            <UploadIcon size={17} />
                            <p>Upload Photo</p>
                        </label>}
                        <input type="file" name='photo' id='photo' className='input-field hidden' onChange={handleInputChange} />
                        {validationErrors.photo && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.photo}</p>}
                    </div>
                    <div className="w-full">
                        <label htmlFor='name' className='offscreen'>Name</label>
                        <input type="text" name='name' className='input-field' placeholder='Name' value={formData.name} onChange={handleInputChange} />
                        {validationErrors.name && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.name}</p>}
                    </div>
                    <div className='flex gap-2'>
                        <div className="w-full flex-1">
                            <label htmlFor='price' className='offscreen'>Price</label>
                            <input type="number" name='price' className='input-field' placeholder='Price' value={formData.price} onChange={handleInputChange} />
                            {validationErrors.price && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.price}</p>}
                        </div>
                        <div className="w-full flex-1">
                            <label htmlFor='quantity' className='offscreen'>Quantity</label>
                            <input type="number" name='quantity' className='input-field' placeholder='Quantity' value={formData.quantity} onChange={handleInputChange} />
                            {validationErrors.quantity && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.quantity}</p>}
                        </div>
                    </div>
                    <button type='submit' className='bg-pri hover:opacity-90 transition-all opacity-80 w-full p-2.5 rounded-md text-sm font-bold cursor-pointer text-white'>
                        {addingFood ? "Adding.." : "Add to Stock"}
                    </button>
                </form>            
            </main>        
        </>
    )
}

export default AddFood;