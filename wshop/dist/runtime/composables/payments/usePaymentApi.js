export function usePaymentApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchPaymentMethods = async () => {
    try {
      return await $fetch("/api/payment/methods");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load payment methods"));
    }
  };
  const processCashPayment = async (payment) => {
    try {
      return await $fetch("/api/payment/cash", {
        method: "POST",
        body: payment
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to process cash payment"));
    }
  };
  const processCardPayment = async (payment) => {
    try {
      return await $fetch("/api/payment/card", {
        method: "POST",
        body: payment
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to process card payment"));
    }
  };
  const generateQRPayment = async (payment) => {
    try {
      return await $fetch("/api/payment/qr", {
        method: "POST",
        body: payment
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to generate QR payment"));
    }
  };
  const checkQRPaymentStatus = async (qrId) => {
    try {
      return await $fetch(`/api/payment/qr/${qrId}/status`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to check QR payment status"));
    }
  };
  const processBankTransfer = async (payment) => {
    try {
      return await $fetch("/api/payment/transfer", {
        method: "POST",
        body: payment
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to process bank transfer"));
    }
  };
  const refundPayment = async (transactionId, amount) => {
    try {
      return await $fetch(`/api/payment/${transactionId}/refund`, {
        method: "POST",
        body: { amount }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to refund payment"));
    }
  };
  const fetchPaymentHistory = async (filters) => {
    try {
      return await $fetch("/api/payment/history", { query: filters });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to get payment history"));
    }
  };
  return {
    fetchPaymentMethods,
    processCashPayment,
    processCardPayment,
    generateQRPayment,
    checkQRPaymentStatus,
    processBankTransfer,
    refundPayment,
    fetchPaymentHistory
  };
}
