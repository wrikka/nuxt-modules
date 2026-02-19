import { useAuth } from "~/composables/core/useAuth";
import { usePointOfSaleApi } from "./usePointOfSaleApi.js";
export function usePosPayment(cart, subtotal, tax, discount, total, selectedCustomer, selectedRegister, products) {
  const api = usePointOfSaleApi();
  const { user: currentUser } = useAuth();
  const processing = ref(false);
  const error = ref(null);
  const processPayment = async (paymentDetails) => {
    processing.value = true;
    error.value = null;
    try {
      if (!cart.value?.items) throw new Error("Cart is not available.");
      if (!currentUser.value) throw new Error("User not authenticated");
      const saleData = {
        sessionId: `POS-${Date.now()}`,
        status: "completed",
        items: cart.value.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal.value,
        tax: tax.value,
        discount: discount.value,
        total: total.value,
        paymentMethod: paymentDetails.method,
        paymentDetails: { amount: paymentDetails.amount, reference: paymentDetails.reference },
        customerId: selectedCustomer.value?.id.toString() || null,
        staffId: (currentUser.value?.id || "0").toString(),
        registerId: selectedRegister.value?.toString() || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        completedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const sale = await api.processSale(saleData);
      for (const item of cart.value.items) {
        const product = products.value?.find((p) => p.id === item.productId);
        const variant = product?.variants?.find((v) => v.id === item.variantId);
        if (variant) {
          await api.updateVariantStock(variant.id.toString(), variant.stock - item.quantity);
        }
      }
      return sale;
    } catch (err) {
      console.error("Failed to process payment:", err);
      error.value = err instanceof Error ? err.message : "Failed to process payment";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  return {
    processing,
    error,
    processPayment
  };
}
