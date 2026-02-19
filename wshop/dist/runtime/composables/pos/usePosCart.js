import { useCart } from "~/composables/useCart";
import { useAppStore } from "~/stores/app";
export function usePosCart(products) {
  const { addNotification } = useAppStore();
  const {
    cart,
    addToCart: addToCartApi,
    updateQuantity: updateQuantityApi,
    removeFromCart: removeFromCartApi,
    clearCart: clearCartApi,
    subtotal,
    total
  } = useCart();
  const addToCart = (product, variant) => {
    if (variant.stock <= 0) {
      addNotification({ type: "warning", message: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2B\u0E21\u0E14\u0E2A\u0E15\u0E47\u0E2D\u0E01" });
      return;
    }
    const existingItem = cart.value?.items.find((item) => item.variantId === variant.id);
    if (existingItem && existingItem.quantity >= variant.stock) {
      addNotification({ type: "warning", message: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E44\u0E21\u0E48\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D" });
      return;
    }
    addToCartApi(product, variant, 1);
  };
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCartApi(itemId);
    }
    const item = cart.value?.items.find((i) => i.id === itemId);
    const product = products.value.find((p) => p.id === item?.productId);
    const variant = product?.variants?.find((v) => v.id === item?.variantId);
    if (item && variant && newQuantity > variant.stock) {
      addNotification({ type: "warning", message: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E44\u0E21\u0E48\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D" });
      return;
    }
    updateQuantityApi(itemId, newQuantity);
  };
  const removeFromCart = (itemId) => {
    removeFromCartApi(itemId);
  };
  const clearCart = () => {
    clearCartApi();
  };
  return {
    cart,
    subtotal,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
}
