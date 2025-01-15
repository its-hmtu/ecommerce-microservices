import React, { useEffect } from 'react'
import { getCart } from '../api/cart'

export const CartContext = React.createContext({})

function CartContextProvider(props: any) {
  const [cart, setCart] = React.useState<any>(null)

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {props.children}
    </CartContext.Provider>
  )
}

export default CartContextProvider