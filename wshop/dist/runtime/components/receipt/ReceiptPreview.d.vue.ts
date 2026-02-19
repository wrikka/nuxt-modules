interface ReceiptItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}
interface ReceiptTotals {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
}
interface Props {
    items: ReceiptItem[];
    totals: ReceiptTotals;
    receiptNumber: string;
    currentDate: string;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=ReceiptPreview.vue.d.ts.map