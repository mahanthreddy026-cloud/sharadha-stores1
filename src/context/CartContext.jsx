import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {

    const exist = cart.find(item => item.id === product.id);

    if (exist) {

      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);

    }

  };

  const removeFromCart = (id) => {

    setCart(cart.filter(item => item.id !== id));

  };

  const increase = (id) => {

    setCart(
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  };

  const decrease = (id) => {

    setCart(
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity > 1
                  ? item.quantity - 1
                  : 1
            }
          : item
      )
    );

  };

  const clearCart = () => {

    setCart([]);

  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart
      }}
    >

      {children}

    </CartContext.Provider>

  );

}

export default CartProvider;