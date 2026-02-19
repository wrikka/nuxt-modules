import { computed, useAsyncData } from "#imports";
import { useDiscountManager } from "./cart/useDiscountManager.js";
import { useGiftCardManager } from "./cart/useGiftCardManager.js";
import { useTaxCalculator } from "./cart/useTaxCalculator.js";
export const useCart = () => {
  const { data: cart, pending, error, refresh } = useAsyncData(
    "cart",
    () => $fetch("/api/cart"),
    { deep: false }
  );
  const cartItems = computed(() => cart.value?.items || []);
  const { taxAmount, taxBreakdown, calculateTaxes } = useTaxCalculator(cartItems);
  const { applyDiscount, removeDiscount } = useDiscountManager(refresh);
  const { applyGiftCard, removeGiftCard } = useGiftCardManager(refresh);
  const addToCart = async (product, variant, quantity = 1) => {
    await $fetch("/api/cart/items", {
      method: "POST",
      body: {
        productId: product.id,
        variantId: variant.id,
        quantity
      }
    });
    return refresh();
  };
  const updateQuantity = async (cartItemId, quantity) => {
    await $fetch(`/api/cart/items/${cartItemId}`, {
      method: "PUT",
      body: { quantity }
    });
    return refresh();
  };
  const removeFromCart = async (cartItemId) => {
    await $fetch(`/api/cart/items/${cartItemId}`, {
      method: "DELETE"
    });
    return refresh();
  };
  const clearCart = async () => {
    await $fetch("/api/cart", { method: "DELETE" });
    taxAmount.value = 0;
    taxBreakdown.value = [];
    return refresh();
  };
  const itemCount = computed(
    () => cart.value?.items?.reduce((total2, item) => total2 + item.quantity, 0) || 0
  );
  const subtotal = computed(() => Number(cart.value?.subtotal || 0));
  const discountAmount = computed(() => Number(cart.value?.discountAmount || 0));
  const giftCardAmount = computed(() => Number(cart.value?.giftCardAmountApplied || 0));
  const shipping = computed(() => 0);
  const total = computed(
    () => subtotal.value - discountAmount.value - giftCardAmount.value + shipping.value + taxAmount.value
  );
  return {
    cart,
    pending,
    error,
    refresh,
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyDiscount,
    removeDiscount,
    applyGiftCard,
    removeGiftCard,
    calculateTaxes,
    // Computed Getters
    itemCount,
    subtotal,
    discountAmount,
    giftCardAmount,
    shipping,
    taxAmount,
    taxBreakdown,
    total
  };
};
