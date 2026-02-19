export const useDiscountManager = (refreshCart) => {
  const applyDiscount = async (code) => {
    if (!code) return { success: false, message: "Please enter a code." };
    try {
      await $fetch("/api/cart/discount", {
        method: "POST",
        body: { code }
      });
      await refreshCart();
      return { success: true, message: `Code '${code}' applied.` };
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        return { success: false, message };
      } else {
        return { success: false, message: "An unknown error occurred." };
      }
    }
  };
  const removeDiscount = async () => {
    try {
      await $fetch("/api/cart/discount", { method: "DELETE" });
      await refreshCart();
      return { success: true, message: "Discount removed." };
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        return { success: false, message };
      } else {
        return { success: false, message: "An unknown error occurred." };
      }
    }
  };
  return {
    applyDiscount,
    removeDiscount
  };
};
