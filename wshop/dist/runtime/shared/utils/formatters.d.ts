/**
 * Format currency amount
 */
export declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
/**
 * Format date with locale
 */
export declare function formatDate(date: string | Date, locale?: string): string;
/**
 * Format date time with locale
 */
export declare function formatDateTime(date: string | Date, locale?: string): string;
/**
 * Format a map of options into a string
 */
export declare const formatOptions: (options: {
    [key: string]: string;
}) => string;
//# sourceMappingURL=formatters.d.ts.map