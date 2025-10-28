// 📦 Đọc giỏ hàng từ localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// 🛒 Lưu giỏ hàng
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ➕ Thêm sản phẩm vào giỏ
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/images/no-image.png",
      quantity,
    });
  }

  saveCart(cart);
  return cart;
};

// ❌ Xóa sản phẩm
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  return cart;
};

// 🔄 Cập nhật số lượng
export const updateQuantity = (id, quantity) => {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity = quantity;
  saveCart(cart);
  return cart;
};

// 🧹 Xóa toàn bộ giỏ
export const clearCart = () => {
  localStorage.removeItem("cart");
};
