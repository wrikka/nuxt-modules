export const useQRPaymentForm = () => {
  const selectedProvider = ref("promptpay");
  const qrPayment = ref(null);
  const timeRemaining = ref("");
  const statusCheckInterval = ref(null);
  const providers = [
    { id: "promptpay", name: "PromptPay", icon: "\u{1F4B0}" },
    { id: "truewallet", name: "TrueMoney Wallet", icon: "\u{1F4B3}" },
    { id: "linepay", name: "LINE Pay", icon: "\u{1F49A}" }
  ];
  const formatTimeRemaining = (expiresAt) => {
    const now = /* @__PURE__ */ new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    if (remaining <= 0) return "\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38";
    const minutes = Math.floor(remaining / 6e4);
    const seconds = Math.floor(remaining % 6e4 / 1e3);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const updateTimer = () => {
    if (qrPayment.value) {
      timeRemaining.value = formatTimeRemaining(new Date(qrPayment.value.expiresAt));
    }
  };
  onMounted(() => {
    setInterval(updateTimer, 1e3);
  });
  onUnmounted(() => {
    if (statusCheckInterval.value) {
      clearInterval(statusCheckInterval.value);
    }
  });
  const setSelectedProvider = (provider) => {
    selectedProvider.value = provider;
  };
  const setQRPayment = (payment) => {
    qrPayment.value = payment;
  };
  const setStatusCheckInterval = (interval) => {
    statusCheckInterval.value = interval;
  };
  const resetForm = () => {
    selectedProvider.value = "promptpay";
    qrPayment.value = null;
    timeRemaining.value = "";
    if (statusCheckInterval.value) {
      clearInterval(statusCheckInterval.value);
      statusCheckInterval.value = null;
    }
  };
  const getFormData = () => ({
    selectedProvider: selectedProvider.value,
    qrPayment: qrPayment.value,
    timeRemaining: timeRemaining.value
  });
  return {
    // State
    selectedProvider: readonly(selectedProvider),
    qrPayment: readonly(qrPayment),
    timeRemaining: readonly(timeRemaining),
    statusCheckInterval: readonly(statusCheckInterval),
    // Data
    providers,
    // Methods
    setSelectedProvider,
    setQRPayment,
    setStatusCheckInterval,
    resetForm,
    getFormData,
    formatTimeRemaining
  };
};
