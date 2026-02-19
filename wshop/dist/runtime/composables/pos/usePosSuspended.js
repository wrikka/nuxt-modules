import { useAuth } from "~/composables/core/useAuth";
import { useCart } from "~/composables/useCart";
import { useAppStore } from "~/stores/app";
import { usePointOfSaleApi } from "./usePointOfSaleApi.js";
export function usePosSuspended(cart, subtotal, total, selectedCustomer, products, customers) {
  const api = usePointOfSaleApi();
  const { user: currentUser } = useAuth();
  const { addNotification } = useAppStore();
  const error = ref(null);
  const suspendSale = async () => {
    if (!cart.value?.items || cart.value.items.length === 0) return;
    if (!currentUser.value) return;
    try {
      await api.suspendSale({
        sessionId: `SUSPENDED-${Date.now()}`,
        items: cart.value.items,
        subtotal: subtotal.value,
        total: total.value,
        customerId: selectedCustomer.value?.id.toString() || null,
        staffId: currentUser.value.id.toString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      addNotification({ type: "success", message: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E02\u0E32\u0E22\u0E41\u0E1A\u0E1A\u0E1E\u0E31\u0E01\u0E44\u0E27\u0E49\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22" });
    } catch (err) {
      console.error("Failed to suspend sale:", err);
      if (err instanceof Error) {
        addNotification({ type: "error", message: `\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E02\u0E32\u0E22\u0E41\u0E1A\u0E1A\u0E1E\u0E31\u0E01\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49: ${err.message}` });
      } else {
        addNotification({ type: "error", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E02\u0E32\u0E22\u0E41\u0E1A\u0E1A\u0E1E\u0E31\u0E01\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49" });
      }
    }
  };
  const resumeSuspendedSale = async (sessionId) => {
    try {
      const sale = await api.fetchSuspendedSale(sessionId);
      if (sale && products && customers) {
        const { clearCart } = useCart();
        await clearCart();
        const { addToCart } = useCart();
        for (const item of sale.items) {
          const product = products.find((p) => p.id === item.productId);
          const variant = product?.variants?.find((v) => v.id === item.variantId);
          if (product && variant) {
            await addToCart(product, variant, item.quantity);
          } else {
            console.warn(`Product or variant not found for suspended item:`, item);
          }
        }
        if (sale.customerId) {
          selectedCustomer.value = customers.find((c) => c.id.toString() === sale.customerId) || null;
        }
      }
    } catch (err) {
      console.error("Failed to resume suspended sale:", err);
      error.value = err instanceof Error ? err.message : "An unknown error occurred";
      addNotification({ type: "error", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E42\u0E2B\u0E25\u0E14\u0E01\u0E32\u0E23\u0E02\u0E32\u0E22\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49" });
    }
  };
  return {
    error,
    suspendSale,
    resumeSuspendedSale
  };
}
