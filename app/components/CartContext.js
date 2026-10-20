'use client';

import { createContext, useContext, useState } from 'react';

const CartContext = createContext({ count: 0, add: () => {} });

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const add = () => setCount((c) => c + 1);
  return <CartContext.Provider value={{ count, add }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
