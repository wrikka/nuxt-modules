import type { POSSession } from "#shared/types";
import jsPDF from "jspdf";
export declare class ReceiptPDFGenerator {
    private pdf;
    private yPosition;
    constructor();
    private addHeader;
    private addReceiptDetails;
    private addItems;
    private addTotals;
    private addFooter;
    generate(session: POSSession): jsPDF;
}
//# sourceMappingURL=receiptGenerator.d.ts.map