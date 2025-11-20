export interface SigninFormData {
    email: string;
    password: string; }


export interface FoodType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    photoUrl?: string | null;
    photoId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}    


export interface SignupFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmpassword: string; }


export interface AddFoodFormData {
    name: string;
    price: string;
    quantity: string;
    photo: Blob | null; }


export interface PasswordResetFormData {
    password: string;
    confirmpassword: string; }

export interface SigninReturnType { 
    isAuthLoading?: boolean;
    message?: string;
    token: string | null;
    user: { 
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        profileUrl: string;
    } | null }

export interface ToastProps {
    message: string | null;
    isError: boolean;
    timeout: number;
}

export interface CartItem {
    id: string,
    userId: string,
    foodId: FoodType,
    quantity: number
}