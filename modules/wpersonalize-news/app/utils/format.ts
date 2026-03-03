export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) { return text; }
  return `${text.slice(0, maxLength).trim()}...`;
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const MILLION = 1_000_000;
const THOUSAND = 1_000;
const DECIMAL_PLACES = 1;

export function formatNumber(num: number): string {
  if (num >= MILLION) { return `${(num / MILLION).toFixed(DECIMAL_PLACES)}M`; }
  if (num >= THOUSAND) { return `${(num / THOUSAND).toFixed(DECIMAL_PLACES)}K`; }
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
