export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
export function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}
