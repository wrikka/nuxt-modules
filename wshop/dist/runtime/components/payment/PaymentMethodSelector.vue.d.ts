import type { PaymentMethod } from '~~/shared/types';
interface Props {
    modelValue: string;
    methods: PaymentMethod[];
    disabled?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (method: PaymentMethod) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: (method: PaymentMethod) => any;
    "onUpdate:modelValue"?: (value: string) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PaymentMethodSelector.vue.d.ts.map