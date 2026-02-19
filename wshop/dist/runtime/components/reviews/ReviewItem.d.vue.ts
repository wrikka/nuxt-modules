import type { Review } from '#shared/types';
interface Props {
    review: Review;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    markHelpful: (reviewId: string) => any;
    report: (reviewId: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onMarkHelpful?: (reviewId: string) => any;
    onReport?: (reviewId: string) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ReviewItem.vue.d.ts.map