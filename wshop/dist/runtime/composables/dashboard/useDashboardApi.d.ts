export declare function useDashboardApi(): {
    fetchStats: () => Promise<any>;
    fetchActivities: () => Promise<any>;
    fetchRealTimeSales: (filters?: {
        period?: "today" | "week" | "month" | "year";
        startDate?: Date;
        endDate?: Date;
    }) => Promise<any>;
    fetchTopProducts: (limit?: number) => Promise<any>;
    fetchSalesByCategory: (period?: "today" | "week" | "month" | "year") => Promise<any>;
    fetchHourlySales: (date?: Date) => Promise<any>;
    fetchPaymentMethodsSummary: (period?: "today" | "week" | "month" | "year") => Promise<any>;
    generateSalesReport: (reportConfig: {
        type: "daily" | "weekly" | "monthly" | "yearly";
        startDate: Date;
        endDate: Date;
        format: "pdf" | "excel";
        includeDetails?: boolean;
    }) => Promise<any>;
};
//# sourceMappingURL=useDashboardApi.d.ts.map