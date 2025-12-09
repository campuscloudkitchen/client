import type { AddDispatchFormData, AddFoodFormData, OrderFormData, PasswordResetFormData, SigninFormData, SignupFormData, UpdateUserFormData } from "./types";

export interface SignInValidationErrors {
    email: string | null;
    password: string | null;
}

export interface SignUpValidationErrors {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
    password: string | null;
    confirmpassword: string | null;
}

export interface AddFoodValidationErrors {
    name: string | null;
    price: string | null;
    quantity: string | null;
    photo: string | null;
}

export interface UpdateUserValidationErrors {
    firstname: string | null;
    lastname: string | null;
    photo: string | null;
}

export interface AddDispatchValidationErrors {
    firstname: string | null;
    lastname: string | null;
    email: string | null;
}

export interface OrderValidationErrors {
    deliveryAddress: string | null;
    phoneNumber: string | null;
}

export interface ResetPasswordValidationErrors {
    password: string | null;
    confirmpassword: string | null;
}

const isEmpty = (value: string) => !value || value.trim().length === 0;

const validateEmailDetailed = (email: string) => {
    if (isEmpty(email)) return "Email is required.";
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        if (!/@/.test(trimmed)) return 'Email must contain the "@" symbol.';
        const [local, domain] = trimmed.split("@");
        if (!local) return "Email is missing the local part before '@'.";
        if (!domain) return "Email is missing the domain after '@'.";
        if (!/\./.test(domain)) return "Email domain must contain a dot (e.g. example.com).";
        if (/\s/.test(trimmed)) return "Email cannot contain spaces.";
        return "Email format is invalid."; }
    const domain = trimmed.split("@")[1];
    if (domain.length < 3) return "Email domain is too short.";
    const tld = domain.split(".").pop();
    if (!/^[A-Za-z]{2,}$/.test(tld!)) return "Email top-level domain (TLD) looks invalid.";
    return null;
}

const validateFirstNameDetailed = (firstname: string): string | null => {
    if (isEmpty(firstname)) return "First name is required.";
    const trimmed = firstname.trim();
    if (trimmed.length < 2) return "First name is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "First name is too long (maximum 50 characters)!";

    
    if (/\d/.test(trimmed)) return "First name cannot contain numbers!";


    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/\s{2,}/.test(trimmed)) return "First name cannot contain consecutive spaces!";
        if (/['-]{2,}/.test(trimmed)) return "First name cannot contain consecutive apostrophes or hyphens!";
        if (/^['-]/.test(trimmed)) return "First name cannot start with a hyphen or apostrophe!";
        if (/['-]$/.test(trimmed)) return "First name cannot end with a hyphen or apostrophe!";
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "First name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "First name format is invalid!";
    }

    if (/^[-' ]+$/.test(trimmed)) return "First name must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "First name appears to be all uppercase!";

    return null;
};

const validateFoodNameDetailed = (firstname: string): string | null => {
    if (isEmpty(firstname)) return "First name is required.";
    const trimmed = firstname.trim();
    if (trimmed.length < 2) return "First name is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "First name is too long (maximum 50 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "First name must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "First name appears to be all uppercase!";
    return null;
};

const validateDeliveryAddressDetailed = (deliveryAddress: string): string | null => {
    if (isEmpty(deliveryAddress)) return "Delivery Address is required.";
    const trimmed = deliveryAddress.trim();
    if (trimmed.length < 2) return "Delivery Address is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "Delivery Address is too long (maximum 100 characters)!";
    if (/^[-' ]+$/.test(trimmed)) return "Delivery Address must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "Delivery Address appears to be all uppercase!";
    return null;
};

const validateLastNameDetailed = (lastname: string): string | null => {
    if (isEmpty(lastname)) return "Last name is required.";
    const trimmed = lastname.trim();
    if (trimmed.length < 2) return "Last name is too short (minimum 2 characters)!";
    if (trimmed.length > 50) return "Last name is too long (maximum 50 characters)!";

    
    if (/\d/.test(trimmed)) return "Last name cannot contain numbers!";


    const namePattern = /^[\p{L}\p{M}'-]+(?:[ -][\p{L}\p{M}'-]+)*$/u;
    if (!namePattern.test(trimmed)) {
        if (/\s{2,}/.test(trimmed)) return "Last name cannot contain consecutive spaces!";
        if (/['-]{2,}/.test(trimmed)) return "Last name cannot contain consecutive apostrophes or hyphens!";
        if (/^['-]/.test(trimmed)) return "Last name cannot start with a hyphen or apostrophe!";
        if (/['-]$/.test(trimmed)) return "Last name cannot end with a hyphen or apostrophe!";
        if (/[^ \p{L}\p{M}'-]/u.test(trimmed)) return "Last name contains invalid characters (only letters, spaces, hyphens and apostrophes are allowed)!";
        return "Last name format is invalid!";
    }

    if (/^[-' ]+$/.test(trimmed)) return "Last name must contain letters!";
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 1) return "Last name appears to be all uppercase!";

    return null;
};


const validatePasswordDetailed = (password: string) => {
    const commonPasswords = ["password", "123456", "12345678", "qwerty", "letmein"];
    const minLength: number = 8;
    const requireUpper: boolean = true;
    const requireLower: boolean = true;
    const requireDigit: boolean = true;
    const requireSpecial: boolean = true;
    const disallowCommon: boolean = true;
    if (isEmpty(password)) return "Password is required.";
    if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
    if (requireUpper && !/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter (A–Z).";
    if (requireLower && !/[a-z]/.test(password)) return "Password must contain at least one lowercase letter (a–z).";
    if (requireDigit && !/[0-9]/.test(password)) return "Password must contain at least one digit (0–9).";
    if (requireSpecial && !/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(password)) return "Password must contain at least one special character (e.g. !@#$%).";
    if (/\s/.test(password)) return "Password cannot contain spaces.";
    if (disallowCommon && commonPasswords.includes(password.toLowerCase())) return "That password is too common — choose a stronger password.";
    if (/([a-zA-Z0-9])\1\1/.test(password)) return "Avoid using the same character three times in a row.";
    return null; }


const validatePhoneNumber = (phone: string) => {
    const commonNumbers = [
        "00000000",
        "11111111",
        "12345678",
        "22222222",
        "99999999"
    ];

    if (!phone || phone.trim() === "") return "Phone number is required.";

    phone = phone.replace(/\s+/g, "");

    const cleaned = phone.startsWith("+") ? phone.slice(1) : phone;

    let local;

    if (cleaned.startsWith("232")) {
        local = cleaned.slice(3); 
    } else if (cleaned.startsWith("0")) {
        local = cleaned.slice(1); 
    } else {
        local = cleaned;
    }

    if (!/^\d{8}$/.test(local)) {
        return "Phone number must be 8 digits after the country code.";
    }

    const prefix = parseInt(local.slice(0, 2)); 

    if (prefix < 20 || prefix > 79) {
        return "Invalid Sierra Leone phone prefix.";
    }

    if (commonNumbers.includes(local)) {
        return "Phone number is too common or invalid — use a real number.";
    }

    if (/^(\d)\1+$/.test(local)) {
        return "Phone number cannot be a repeated digit.";
    }

    return null;
};



const validateConfirmPasswordDetailed = (password: string, confirmpassword: string) => {
    if(password !== confirmpassword) return "Passwords must be the same!"
    return null; }

export const validatePriceDetailed = (price: number | string): string | null => {
    if (isEmpty(price.toString())) return "Price is required.";
    const num = Number(price);
    if (isNaN(num)) return "Price must be a number.";
    if (num <= 0) return "Price must be greater than zero.";
    return null; };

export const validateQuantityDetailed = (quantity: number | string): string | null => {
    if (isEmpty(quantity.toString())) return "Quantity is required.";
    const num = Number(quantity);
    if (isNaN(num)) return "Quantity must be a number.";
    if (!Number.isInteger(num)) return "Quantity must be a whole number.";
    if (num <= 0) return "Quantity must be greater than zero.";
    return null; };

export const validateFileDetailed = (file: Blob | null): string | null => {
    if (!file) return "File is required.";
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMB = 5;

    if (!allowedTypes.includes(file.type)) 
        return "Only JPG, PNG, or WEBP files are allowed.";
    
    if (file.size > maxSizeMB * 1024 * 1024) 
        return `File size must be less than ${maxSizeMB}MB.`;
    
    return null; };


    
export const signInValidationRules = (formdata: SigninFormData) => {
    const errors: SignInValidationErrors = { email: null, password: null };
    errors.email = validateEmailDetailed(formdata.email);
    errors.password = validatePasswordDetailed(formdata.password);
    return errors; }


    
export const signUpValidationRules = (formdata: SignupFormData) => {
    const errors: SignUpValidationErrors = { firstname: null, lastname: null, email: null, password: null, confirmpassword: null };
    errors.email = validateEmailDetailed(formdata.email);
    errors.password = validatePasswordDetailed(formdata.password);
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }



export const forgotPasswordValidationRules = (email: string) => {
    const error = validateEmailDetailed(email);
    return error; }



export const resetPasswordValidationRules = (formdata: PasswordResetFormData) => {
    const errors: ResetPasswordValidationErrors = { password: null, confirmpassword: null };
    errors.password = validatePasswordDetailed(formdata.password);
    errors.confirmpassword = validateConfirmPasswordDetailed(formdata.password, formdata.confirmpassword);
    return errors; }


export const addFoodValidationRules = (formdata: AddFoodFormData) => {
    const errors: AddFoodValidationErrors = { name: null, price: null, quantity: null, photo: null };
    errors.name = validateFoodNameDetailed(formdata.name);
    errors.price = validatePriceDetailed(formdata.price);
    errors.quantity = validateQuantityDetailed(formdata.quantity);
    return errors; }


export const updateUserValidationRules = (formdata: UpdateUserFormData) => {
    const errors: UpdateUserValidationErrors = { firstname: null, lastname: null, photo: null };
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    return errors; }


export const addDispatchValidationRules = (formdata: AddDispatchFormData) => {
    const errors: AddDispatchValidationErrors = { firstname: null, lastname: null, email: null };
    errors.firstname = validateFirstNameDetailed(formdata.firstname);
    errors.lastname = validateLastNameDetailed(formdata.lastname);
    errors.email = validateEmailDetailed(formdata.email);
    return errors; }


export const orderValidationRules = (formdata: OrderFormData) => {
    const errors: OrderValidationErrors = { deliveryAddress: null, phoneNumber: null };
    errors.deliveryAddress = validateDeliveryAddressDetailed(formdata.deliveryAddress);
    errors.phoneNumber = validatePhoneNumber(formdata.phoneNumber);
    return errors; }