interface Rate {
    id: number;
    name: string;
    price: number;
    currency: string;
}
interface ShippingZone {
    id: number;
    name: string;
    countries: string[];
    rates: Rate[];
}
type __VLS_Props = {
    zones: ShippingZone[];
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ShippingZoneList.vue.d.ts.map