declare const __VLS_export: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    save: (customer: Omit<Customer, "role" | "id" | "createdAt" | "updatedAt" | "password" | "username" | "permissions" | "isActive" | "lastLogin" | "avatar">) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{
    onSave?: (customer: Omit<Customer, "role" | "id" | "createdAt" | "updatedAt" | "password" | "username" | "permissions" | "isActive" | "lastLogin" | "avatar">) => any;
    onCancel?: () => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=CustomerForm.vue.d.ts.map