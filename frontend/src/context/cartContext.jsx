import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "../utils/cartUtils";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // 🔹 Lấy dữ liệu ban đầu từ localStorage
  useEffect(() => {
    const cart = getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

    // Lắng nghe thay đổi localStorage từ nơi khác (nếu có)
    const handleStorage = () => {
      const updatedCart = getCart();
      setCartCount(updatedCart.reduce((sum, i) => sum + i.quantity, 0));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Hàm cập nhật thủ công (gọi sau khi thêm vào giỏ)
  const refreshCartCount = () => {
    const cart = getCart();
    setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
