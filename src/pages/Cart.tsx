import React from 'react';
import Header from '../components/Header';
import { useGetCartQuery } from '../app/api/cart';

const Cart: React.FC = () => {

  const { data, isLoading } = useGetCartQuery(null);
  console.log(data)
  return (
    <>
      <Header />
      Cart
    </>
  )
}

export default Cart;