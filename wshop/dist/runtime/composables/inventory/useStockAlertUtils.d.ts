import type { StockAlert } from "#shared/types";
export declare const useStockAlertUtils: () => {
    getAlertIcon: (alertType: StockAlert["alertType"]) => string;
    getSeverityColor: (severity: StockAlert["severity"]) => string;
    getSeverityLabel: (severity: StockAlert["severity"]) => string;
    formatTime: (date: Date) => string;
    getAlertStats: (alerts: StockAlert[]) => {
        total: number;
        unread: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    getUnreadAlerts: (alerts: StockAlert[]) => StockAlert[];
};
//# sourceMappingURL=useStockAlertUtils.d.ts.map