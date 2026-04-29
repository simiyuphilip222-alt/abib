const CART_STORAGE_KEY = "abib_cart";
const CART_EVENT = "abib-cart-updated";

export const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const writeCart = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
  return items;
};

export const clearCartStorage = () => writeCart([]);

export const addCartItem = (product, quantity = 1) => {
  const cart = readCart();
  const itemId = product._id || product.id;
  const existingItem = cart.find((item) => item.id === itemId);

  const nextCart = existingItem
    ? cart.map((item) =>
        item.id === itemId ? { ...item, qty: item.qty + quantity } : item
      )
    : [
        ...cart,
        {
          id: itemId,
          name: product.name,
          price: Number(product.price || 0),
          qty: quantity,
          image: product.images?.[0] || product.mainImage || null,
        },
      ];

  return writeCart(nextCart);
};

export const getCartCount = () =>
  readCart().reduce((sum, item) => sum + Number(item.qty || 0), 0);

export const getCartTotal = () =>
  readCart().reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
    0
  );

export { CART_EVENT, CART_STORAGE_KEY };
