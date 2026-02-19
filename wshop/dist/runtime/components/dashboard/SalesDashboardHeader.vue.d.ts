type __VLS_Props = {
    selectedPeriod: 'today' | 'week' | 'month' | 'year';
    isAutoRefresh: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "toggle-auto-refresh": (...args: any[]) => void;
    "update:selectedPeriod": (...args: any[]) => void;
    "update:isAutoRefresh": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onToggle-auto-refresh"?: (...args: any[]) => any;
    "onUpdate:selectedPeriod"?: (...args: any[]) => any;
    "onUpdate:isAutoRefresh"?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=SalesDashboardHeader.vue.d.ts.map