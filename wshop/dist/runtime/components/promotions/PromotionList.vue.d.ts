import type { Promotion } from '~~/shared/types';
type __VLS_Props = {
    promotions: Promotion[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    create: (...args: any[]) => void;
    delete: (...args: any[]) => void;
    edit: (...args: any[]) => void;
    duplicate: (...args: any[]) => void;
    toggleStatus: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onCreate?: (...args: any[]) => any;
    onDelete?: (...args: any[]) => any;
    onEdit?: (...args: any[]) => any;
    onDuplicate?: (...args: any[]) => any;
    onToggleStatus?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PromotionList.vue.d.ts.map