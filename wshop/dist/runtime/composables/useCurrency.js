import { useState } from "#imports";
export const useCurrency = () => {
  const currency = useState("currency", () => "THB");
  const exchangeRates = useState("exchangeRates", () => ({
    THB: 1,
    USD: 0.028,
    EUR: 0.026,
    GBP: 0.022
  }));
  const formatPrice = (price, _fromCurrency = "THB") => {
    const rate = exchangeRates.value[currency.value] || 1;
    const convertedPrice = price * rate;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.value,
      minimumFractionDigits: 2
    }).format(convertedPrice);
  };
  const convertPrice = (price, _fromCurrency = "THB") => {
    const rate = exchangeRates.value[currency.value] || 1;
    return price * rate;
  };
  const setCurrency = (newCurrency) => {
    currency.value = newCurrency;
  };
  return {
    currency,
    exchangeRates,
    formatPrice,
    convertPrice,
    setCurrency
  };
};
