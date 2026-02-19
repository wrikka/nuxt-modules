import type { Review } from '#shared/types';
type __VLS_Props = {
    review: Review;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    report: (reviewId: string) => any;
    "mark-helpful": (reviewId: string) => any;
    "open-image": (image: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onReport?: (reviewId: string) => any;
    "onMark-helpful"?: (reviewId: string) => any;
    "onOpen-image"?: (image: string) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ReviewListItem.vue.d.ts.map