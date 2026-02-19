interface Props {
    loading: boolean;
    emailAddress: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    printBrowser: () => any;
    generatePDF: () => any;
    generateImage: () => any;
    generateTaxInvoice: () => any;
    sendEmail: () => any;
    "update:emailAddress": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onPrintBrowser?: () => any;
    onGeneratePDF?: () => any;
    onGenerateImage?: () => any;
    onGenerateTaxInvoice?: () => any;
    onSendEmail?: () => any;
    "onUpdate:emailAddress"?: (value: string) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=PrintActions.vue.d.ts.map