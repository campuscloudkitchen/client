import type React from "react";
import type { ToastProps } from "../utils/types";
import { useEffect } from "react";


interface Props {
    toastProps: ToastProps,
    setToastProps: React.Dispatch<React.SetStateAction<ToastProps>>,
}


const Toast: React.FC<Props> = ({ toastProps, setToastProps }) => {

    useEffect(() => {
        let toastTimeout: number;
        if(toastProps.message){
            toastTimeout = setTimeout(() => {
                setToastProps({ message: null, isError: false, timeout: 0 })
            }, toastProps.timeout);
        }
        return () => clearTimeout(toastTimeout);
    }, [setToastProps, toastProps]);


    return (
        <>{toastProps.message && <div className={`text-[0.75rem] border p-3 rounded-md text-green-600 bg-green-50 border-green-600 animate-bounce fixed top-18 flex justify-center items-center max-w-sm mx-auto font-bold z-50 ${toastProps.isError && "bg-red-50 text-red-600 border-red-600"}`}>
            {toastProps.message}
        </div>}</>
    )
}


export default Toast;