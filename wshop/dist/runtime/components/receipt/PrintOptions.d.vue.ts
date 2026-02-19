interface PrintOptions {
    includeLogo: boolean;
    includeBarcode: boolean;
    includeQRCode: boolean;
    includeTerms: boolean;
}
interface PrinterSettings {
    paperSize: string;
    fontSize: string;
    copies: number;
}
interface Props {
    printOptions: PrintOptions;
    printerSettings: PrinterSettings;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:includeLogo": (value: boolean) => any;
    "update:includeBarcode": (value: boolean) => any;
    "update:includeQRCode": (value: boolean) => any;
    "update:includeTerms": (value: boolean) => any;
    "update:paperSize": (value: string) => any;
    "update:fontSize": (value: string) => any;
    "update:copies": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:includeLogo"?: (value: boolean) => any;
    "onUpdate:includeBarcode"?: (value: boolean) => any;
    "onUpdate:includeQRCode"?: (value: boolean) => any;
    "onUpdate:includeTerms"?: (value: boolean) => any;
    "onUpdate:paperSize"?: (value: string) => any;
    "onUpdate:fontSize"?: (value: string) => any;
    "onUpdate:copies"?: (value: number) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PrintOptions.vue.d.ts.map