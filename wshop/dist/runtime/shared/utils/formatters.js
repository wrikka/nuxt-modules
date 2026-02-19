export function formatCurrency(amount, currency = "THB", locale = "th-TH") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
}
export function formatDate(date, locale = "th-TH") {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(dateObj);
}
export function formatDateTime(date, locale = "th-TH") {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(dateObj);
}
export const formatOptions = (options) => {
  if (!options || Object.keys(options).length === 0) {
    return "";
  }
  return Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(", ");
};
