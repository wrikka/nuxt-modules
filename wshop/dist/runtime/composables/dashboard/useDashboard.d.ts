export declare const useDashboard: () => {
    stats: any;
    statsPending: any;
    statsError: any;
    recentActivities: any;
    activitiesPending: any;
    activitiesError: any;
    refreshStats: any;
    refreshActivities: any;
    salesData: any;
    salesPending: any;
    salesError: any;
    refreshSales: any;
    loadRealTimeSales: (filters?: {
        period?: "today" | "week" | "month" | "year";
        startDate?: Date;
        endDate?: Date;
    }) => void;
    loadSalesSummary: (period?: "today" | "week" | "month" | "year") => void;
    loadTopProducts: (limit?: number) => Promise<any>;
    loadSalesByCategory: (period?: "today" | "week" | "month" | "year") => Promise<any>;
    loadHourlySales: (date?: Date) => Promise<any>;
    loadPaymentMethodsSummary: (period?: "today" | "week" | "month" | "year") => Promise<any>;
    generateSalesReport: (reportConfig: {
        type: "daily" | "weekly" | "monthly" | "yearly";
        startDate: Date;
        endDate: Date;
        format: "pdf" | "excel";
        includeDetails?: boolean;
    }) => Promise<any>;
    startAutoRefresh: (interval?: number) => void;
    stopAutoRefresh: () => void;
};
//# sourceMappingURL=useDashboard.d.ts.map