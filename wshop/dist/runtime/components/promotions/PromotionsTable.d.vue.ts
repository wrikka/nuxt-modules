import type { Promotion } from '~~/shared/types';
type __VLS_Props = {
    promotions: Promotion[];
    loading: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    delete: (...args: any[]) => void;
    edit: (...args: any[]) => void;
    duplicate: (...args: any[]) => void;
    "toggle-status": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: (...args: any[]) => any;
    onEdit?: (...args: any[]) => any;
    onDuplicate?: (...args: any[]) => any;
    "onToggle-status"?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PromotionsTable.vue.d.ts.map