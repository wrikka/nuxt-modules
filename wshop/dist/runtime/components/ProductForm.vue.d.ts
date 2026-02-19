import type { FormErrors } from "vee-validate";
type __VLS_Props = {
    errors: FormErrors<Record<string, any>>;
};
type __VLS_ModelProps = {
    "name"?: string;
    "price"?: string;
    "stock"?: number;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    'submit-button'?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (...args: any[]) => void;
    "update:name": (value: string | undefined) => void;
    "update:price": (value: string | undefined) => void;
    "update:stock": (value: number | undefined) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    onSubmit?: (...args: any[]) => any;
    "onUpdate:name"?: (value: string | undefined) => any;
    "onUpdate:price"?: (value: string | undefined) => any;
    "onUpdate:stock"?: (value: number | undefined) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=ProductForm.vue.d.ts.map