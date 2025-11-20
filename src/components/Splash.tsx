import React from 'react';

const Splash: React.FC = () => {
  return (
    <main className='fixed top-0 bottom-0 left-0 right-0 bg-white flex justify-center items-center'>
        <img src='/icon.png' className='w-20 animate-pulse' />
    </main>
  )
}

export default Splash;