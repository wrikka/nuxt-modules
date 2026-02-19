import jsPDF from "jspdf";
import { RECEIPT_CONFIG, STORE_INFO } from "~/constants/store";
import { generateReceiptData } from "~/utils/receipt";
export class ReceiptPDFGenerator {
  pdf;
  yPosition = 50;
  constructor() {
    this.pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [RECEIPT_CONFIG.width, RECEIPT_CONFIG.height]
    });
    this.pdf.setFont(RECEIPT_CONFIG.font);
  }
  addHeader() {
    this.pdf.setFontSize(16);
    this.pdf.text(STORE_INFO.name, 40, 20, { align: "center" });
    this.pdf.setFontSize(10);
    this.pdf.text(STORE_INFO.address, 40, 28, { align: "center" });
    this.pdf.text(STORE_INFO.city, 40, 33, { align: "center" });
    this.pdf.text(`\u0E42\u0E17\u0E23: ${STORE_INFO.phone}`, 40, 36, { align: "center" });
  }
  addReceiptDetails(receipt) {
    this.pdf.setFontSize(9);
    this.pdf.text(`\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48: ${receipt.receiptNumber}`, 10, this.yPosition);
    this.yPosition += 5;
    this.pdf.text(`\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48: ${new Date(receipt.createdAt).toLocaleString("th-TH")}`, 10, this.yPosition);
    this.yPosition += 5;
    this.pdf.text(`\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19: ${receipt.staff.name}`, 10, this.yPosition);
    this.yPosition += 5;
    if (receipt.customer && receipt.customer.name !== "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B") {
      this.pdf.text(`\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32: ${receipt.customer.name}`, 10, this.yPosition);
      this.yPosition += 5;
    }
  }
  addItems(items) {
    this.yPosition += 10;
    this.pdf.text("\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", 10, this.yPosition);
    this.pdf.text("\u0E08\u0E33\u0E19\u0E27\u0E19", 60, this.yPosition);
    this.pdf.text("\u0E23\u0E32\u0E04\u0E32", 80, this.yPosition);
    this.pdf.text("\u0E23\u0E27\u0E21", 100, this.yPosition);
    this.yPosition += 5;
    items.forEach((item) => {
      const name = item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name;
      this.pdf.text(name, 10, this.yPosition);
      this.pdf.text(item.quantity.toString(), 60, this.yPosition);
      this.pdf.text(item.price.toFixed(2), 80, this.yPosition);
      this.pdf.text(item.subtotal.toFixed(2), 100, this.yPosition);
      this.yPosition += 5;
    });
  }
  addTotals(totals) {
    this.yPosition += 10;
    this.pdf.text("\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21:", 80, this.yPosition);
    this.pdf.text(totals.subtotal.toFixed(2), 100, this.yPosition);
    this.yPosition += 5;
    if (totals.discount > 0) {
      this.pdf.text("\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14:", 80, this.yPosition);
      this.pdf.text(`-${totals.discount.toFixed(2)}`, 100, this.yPosition);
      this.yPosition += 5;
    }
    this.pdf.text("\u0E20\u0E32\u0E29\u0E35 7%:", 80, this.yPosition);
    this.pdf.text(totals.tax.toFixed(2), 100, this.yPosition);
    this.yPosition += 5;
    this.pdf.setFontSize(12);
    this.pdf.text("\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14:", 70, this.yPosition);
    this.pdf.text(totals.total.toFixed(2), 100, this.yPosition);
  }
  addFooter() {
    this.yPosition += 15;
    this.pdf.setFontSize(9);
    this.pdf.text("\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23", 40, this.yPosition, { align: "center" });
    this.yPosition += 5;
    this.pdf.text("\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E0B\u0E37\u0E49\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E04\u0E37\u0E19\u0E44\u0E14\u0E49", 40, this.yPosition, { align: "center" });
  }
  generate(session) {
    const receipt = generateReceiptData(session);
    this.addHeader();
    this.addReceiptDetails(receipt);
    this.addItems(receipt.items);
    this.addTotals(receipt.totals);
    this.addFooter();
    return this.pdf;
  }
}
