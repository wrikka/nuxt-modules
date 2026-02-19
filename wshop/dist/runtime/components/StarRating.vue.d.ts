interface Props {
    rating: number;
    size?: number;
    interactive?: boolean;
    showCount?: boolean;
    count?: number;
    ratingCount?: number;
    containerClass?: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:rating": (rating: number) => any;
    "rating-change": (rating: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:rating"?: (rating: number) => any;
    "onRating-change"?: (rating: number) => any;
}>, {
    size: number;
    interactive: boolean;
    showCount: boolean;
    containerClass: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=StarRating.vue.d.ts.map