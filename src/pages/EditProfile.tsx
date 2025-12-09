import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../components/Header';
import type { ToastProps, UpdateUserFormData } from '../utils/types';
import { updateUserValidationRules, type UpdateUserValidationErrors } from '../utils/validationRules';
import { UploadIcon, X } from 'lucide-react';
import Toast from '../components/Toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { useUpdateUserMutation } from '../app/api/user';
import { setUser } from '../app/authSlice';

const EditProfile: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const [updateUser, { isLoading: updatingFood }] = useUpdateUserMutation();
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [formData, setFormData] = useState<UpdateUserFormData>({ firstname: "", lastname: "", photo: null });
    const [validationErrors, setValidationErrors] = useState<UpdateUserValidationErrors>({ firstname: null, lastname: null, photo: null });
    const [toastProps, setToastProps] = useState<ToastProps>({ message: null, timeout: 0, isError: false });

    useEffect(() => {
        if(user){
            setPhotoUrl(user.profileUrl ?? "");
            setFormData({ firstname: user.firstname, lastname: user.lastname, photo: null });
        }
    }, [user])

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
        const errors = updateUserValidationRules(formData);
        setValidationErrors(errors)
        if(Object.values(errors).filter(value => value !== null).length > 0) return;
        const body = new FormData();
        body.append("firstname", formData.firstname);
        body.append("lastname", formData.lastname);
        body.append("photo", formData.photo as Blob);
        try{
            const response = await updateUser({id: id!, body}).unwrap();
            if(response.id) {
                setUser(response);
                navigate(`/profile/${response.id}`);
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
                {<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center w-full gap-2 max-w-[300px]">
                    <div className="w-full flex flex-col gap-2 relative">
                        {photoUrl && <><div className='bg-white absolute top-2 right-2 w-5 h-5 flex justify-center items-center' onClick={removeImg}><X size={16} /></div>
                        <img src={photoUrl} alt='' className='w-full' /></>}
                        {!photoUrl && <label htmlFor='photo' className='text-sm bg-black text-white w-full flex justify-center gap-1 py-2 rounded-md cursor-pointer'>
                            <UploadIcon size={17} />
                            <p>Upload Profile Photo</p>
                        </label>}
                        <input type="file" name='photo' id='photo' className='input-field hidden' onChange={handleInputChange} />
                        {validationErrors.photo && <p className='text-[0.65rem] text-red-600 mt-0.5 font-semibold'>{validationErrors.photo}</p>}
                    </div>
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
                    <button type='submit' className='bg-pri hover:opacity-90 transition-all opacity-80 w-full p-2.5 rounded-md text-sm font-bold cursor-pointer text-white'>
                        {updatingFood ? "Updating..." : "Update"}
                    </button>
                </form>}            
            </main>        
        </>
    )
}

export default EditProfile;