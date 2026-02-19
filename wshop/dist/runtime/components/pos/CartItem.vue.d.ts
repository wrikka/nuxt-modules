import type { CartItem } from '~~/shared/types';
type __VLS_Props = {
    item: CartItem;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update-quantity": (itemId: number, quantity: number) => any;
    "remove-from-cart": (itemId: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate-quantity"?: (itemId: number, quantity: number) => any;
    "onRemove-from-cart"?: (itemId: number) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CartItem.vue.d.ts.map