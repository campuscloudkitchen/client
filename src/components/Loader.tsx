import React from 'react';
import { LoaderCircle } from 'lucide-react';

const Loader: React.FC = () => {
    return (
        <div className='w-full flex justify-center items-center p-2'><LoaderCircle size={17} className='animate-spin text-pri' /></div>
    );
}

export default Loader;