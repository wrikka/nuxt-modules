import { useState } from "#imports";
export const useTaxCalculator = (cartItems) => {
  const taxAmount = useState("taxAmount", () => 0);
  const taxBreakdown = useState("taxBreakdown", () => []);
  const calculateTaxes = async (shippingAddress) => {
    if (!cartItems.value || cartItems.value.length === 0 || !shippingAddress) {
      taxAmount.value = 0;
      taxBreakdown.value = [];
      return;
    }
    try {
      const lineItems = cartItems.value.map((item) => ({
        id: item.variantId,
        quantity: item.quantity,
        price: Number(item.price),
        taxCode: "txcd_99999999"
        // Placeholder: This should come from the product data
      }));
      const response = await $fetch(
        "/api/stripe/tax/calculate",
        {
          method: "POST",
          body: {
            lineItems,
            shippingAddress,
            currency: "thb"
          }
        }
      );
      taxAmount.value = response.taxAmount;
      taxBreakdown.value = response.taxBreakdown;
    } catch (error) {
      console.error("Failed to calculate taxes:", error);
      taxAmount.value = 0;
      taxBreakdown.value = [];
    }
  };
  return {
    taxAmount,
    taxBreakdown,
    calculateTaxes
  };
};
