import { ref } from "#imports";
export function usePayment() {
  const processing = ref(false);
  const error = ref(null);
  const processCardPayment = async (payment) => {
    processing.value = true;
    error.value = null;
    try {
      const result = await $fetch("/api/payment/card", {
        method: "POST",
        body: payment
      });
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Payment failed";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const processCashPayment = async (payment) => {
    processing.value = true;
    error.value = null;
    try {
      const result = await $fetch("/api/payment/cash", {
        method: "POST",
        body: payment
      });
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Payment failed";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const generateQRPayment = async (amount, provider) => {
    processing.value = true;
    error.value = null;
    try {
      const result = await $fetch("/api/payment/qr/generate", {
        method: "POST",
        body: { amount, provider }
      });
      const payment = "data" in result ? result.data : result;
      if (!payment || typeof payment !== "object") {
        throw new Error("Invalid payment response");
      }
      return {
        ...payment,
        expiresAt: new Date(payment.expiresAt)
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to generate QR payment";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const checkQRPaymentStatus = async (paymentId) => {
    try {
      const result = await $fetch(`/api/payment/qr/${paymentId}/status`);
      const status = "data" in result ? result.data : result;
      return status;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to check payment status";
      throw err;
    }
  };
  const startQRStatusCheck = (paymentId, callback) => {
    const interval = setInterval(async () => {
      try {
        const result = await checkQRPaymentStatus(paymentId);
        const status = typeof result === "string" ? result : result.status;
        callback(status);
        if (status === "paid" || status === "expired") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to check QR payment status:", err);
      }
    }, 2e3);
    return interval;
  };
  return {
    processing,
    error,
    processCardPayment,
    processCashPayment,
    generateQRPayment,
    checkQRPaymentStatus,
    startQRStatusCheck
  };
}
