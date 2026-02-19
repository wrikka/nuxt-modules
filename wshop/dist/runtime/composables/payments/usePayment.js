import { readonly, ref } from "vue";
import { usePaymentApi } from "./usePaymentApi.js";
export const usePayment = () => {
  const paymentMethods = ref([]);
  const currentTransaction = ref(null);
  const qrPayments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const api = usePaymentApi();
  const executeAction = async (action, errorMessage) => {
    loading.value = true;
    error.value = null;
    try {
      return await action();
    } catch (err) {
      error.value = err instanceof Error ? err.message : errorMessage;
      return null;
    } finally {
      loading.value = false;
    }
  };
  const startQRStatusCheck = (qrId, interval = 3e3) => {
    const check = async () => {
      const payment = await executeAction(
        () => api.checkQRPaymentStatus(qrId),
        "Failed to check QR payment status"
      );
      if (payment && (payment.status === "paid" || payment.status === "expired")) {
        const index = qrPayments.value.findIndex((p) => p.id === qrId);
        if (index !== -1) qrPayments.value[index] = payment;
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  };
  return {
    paymentMethods: readonly(paymentMethods),
    currentTransaction: readonly(currentTransaction),
    qrPayments: readonly(qrPayments),
    loading: readonly(loading),
    error: readonly(error),
    loadPaymentMethods: () => executeAction(api.fetchPaymentMethods, "Failed to load payment methods"),
    processCashPayment: (payment) => executeAction(() => api.processCashPayment(payment), "Failed to process cash payment"),
    processCardPayment: (payment) => executeAction(() => api.processCardPayment(payment), "Failed to process card payment"),
    generateQRPayment: (payment) => executeAction(() => api.generateQRPayment(payment), "Failed to generate QR payment"),
    checkQRPaymentStatus: (qrId) => executeAction(() => api.checkQRPaymentStatus(qrId), "Failed to check QR payment status"),
    processBankTransfer: (payment) => executeAction(() => api.processBankTransfer(payment), "Failed to process bank transfer"),
    refundPayment: (transactionId, amount) => executeAction(() => api.refundPayment(transactionId, amount), "Failed to refund payment"),
    getPaymentHistory: (filters) => executeAction(() => api.fetchPaymentHistory(filters), "Failed to get payment history"),
    startQRStatusCheck
  };
};
