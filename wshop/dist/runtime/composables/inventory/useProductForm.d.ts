import type { Product } from "#shared/types";
export declare const useProductForm: (product?: Product) => {
    name: import("vue").Ref<never, never>;
    nameAttrs: import("vue").Ref<import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject, import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject>;
    price: import("vue").Ref<never, never>;
    priceAttrs: import("vue").Ref<import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject, import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject>;
    stock: import("vue").Ref<never, never>;
    stockAttrs: import("vue").Ref<import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject, import("vee-validate").BaseFieldProps & import("vee-validate").GenericObject>;
    errors: import("vue").ComputedRef<Partial<Record<any, string | undefined>>>;
    isSubmitting: import("vue").Ref<boolean, boolean>;
    onSubmit: (e?: Event) => Promise<Promise<void> | undefined>;
};
//# sourceMappingURL=useProductForm.d.ts.map