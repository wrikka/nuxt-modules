export const useCardForm = () => {
  const cardNumber = ref("");
  const expiryMonth = ref("");
  const expiryYear = ref("");
  const cvv = ref("");
  const cardHolderName = ref("");
  const expiryMonthRef = ref();
  const expiryYearRef = ref();
  const cvvRef = ref();
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };
  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5") || cleaned.startsWith("2")) return "mastercard";
    if (cleaned.startsWith("35")) return "jcb";
    return "visa";
  };
  const handleCardNumberInput = (event) => {
    const target = event.target;
    cardNumber.value = formatCardNumber(target.value.replace(/\D/g, ""));
  };
  const handleExpiryMonthInput = (event) => {
    const target = event.target;
    let value = target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    if (parseInt(value) > 12) value = "12";
    expiryMonth.value = value;
  };
  const handleExpiryYearInput = (event) => {
    const target = event.target;
    let value = target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    expiryYear.value = value;
  };
  const handleCvvInput = (event) => {
    const target = event.target;
    cvv.value = target.value.replace(/\D/g, "").slice(0, 3);
  };
  const isFormValid = computed(() => {
    const cleanedCardNumber = cardNumber.value.replace(/\s/g, "");
    return cleanedCardNumber.length >= 13 && cleanedCardNumber.length <= 19 && expiryMonth.value.length === 2 && expiryYear.value.length === 2 && cvv.value.length === 3 && cardHolderName.value.trim().length > 0;
  });
  watch(cardNumber, (newValue) => {
    if (newValue.replace(/\s/g, "").length === 16) {
      expiryMonthRef.value?.focus();
    }
  });
  watch(expiryMonth, (newValue) => {
    if (newValue.length === 2) {
      expiryYearRef.value?.focus();
    }
  });
  watch(expiryYear, (newValue) => {
    if (newValue.length === 2) {
      cvvRef.value?.focus();
    }
  });
  const resetForm = () => {
    cardNumber.value = "";
    expiryMonth.value = "";
    expiryYear.value = "";
    cvv.value = "";
    cardHolderName.value = "";
  };
  const getFormData = () => ({
    cardNumber: cardNumber.value.replace(/\s/g, ""),
    expiryMonth: expiryMonth.value,
    expiryYear: expiryYear.value,
    cvv: cvv.value,
    cardHolderName: cardHolderName.value.trim()
  });
  return {
    // State
    cardNumber: readonly(cardNumber),
    expiryMonth: readonly(expiryMonth),
    expiryYear: readonly(expiryYear),
    cvv: readonly(cvv),
    cardHolderName: readonly(cardHolderName),
    // Refs
    expiryMonthRef,
    expiryYearRef,
    cvvRef,
    // Computed
    isFormValid: readonly(isFormValid),
    cardType: computed(() => getCardType(cardNumber.value)),
    // Methods
    handleCardNumberInput,
    handleExpiryMonthInput,
    handleExpiryYearInput,
    handleCvvInput,
    resetForm,
    getFormData,
    // Setters for v-model
    setCardNumber: (value) => cardNumber.value = value,
    setExpiryMonth: (value) => expiryMonth.value = value,
    setExpiryYear: (value) => expiryYear.value = value,
    setCvv: (value) => cvv.value = value,
    setCardHolderName: (value) => cardHolderName.value = value
  };
};
