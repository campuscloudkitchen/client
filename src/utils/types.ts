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


export interface UpdateUserFormData {
    firstname: string;
    lastname: string;
    photo: Blob | null; }


export interface AddDispatchFormData {
    firstname: string;
    lastname: string;
    email: string; }


export interface OrderFormData {
    deliveryAddress: string;
    phoneNumber: string; }


export interface PasswordResetFormData {
    password: string;
    confirmpassword: string; }

export interface SigninReturnType { 
    isAuthLoading?: boolean;
    message?: string;
    token: string | null;
    user: User | null }

export interface User { 
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    profileUrl: string;
}

export interface ToastProps {
    message: string | null;
    isError: boolean;
    timeout: number;
}

export interface CartItem {
    id: string,
    userId: string,
    food?: FoodType,
    foodId: FoodType | string,
    quantity: number
}

export interface UpdateQuantityPayload {
    id: string,
    type: string,
    quantity: number
}

export interface OrderItem {
  id: string;
  foodId: string;
  quantity: number;
  price: number;
  food: {
    id: string;
    name: string;
    price: number;
    photoUrl: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  deliveryAddress: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  deliveryAddress: string;
  phoneNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; 
  updatedAt: string;  
  items: OrderItem[];
}

export interface NotificationType {
    id: string;
    title: string;
    reason: string;
    createdAt: string;
    updatedAt: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";