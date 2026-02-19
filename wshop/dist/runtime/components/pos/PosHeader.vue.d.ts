import type { POSRegister as Register, User } from '#shared/types';
type __VLS_Props = {
    registers: Register[];
    selectedRegister: number | null;
    currentUser: User;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "open-settings": () => any;
    "end-shift": () => any;
    "update:selectedRegister": (registerId: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onOpen-settings"?: () => any;
    "onEnd-shift"?: () => any;
    "onUpdate:selectedRegister"?: (registerId: number) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PosHeader.vue.d.ts.map