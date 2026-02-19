import { computed, ref } from "vue";
import { generateReceiptData } from "../../utils/receipt.js";
import { useHtmlRenderer } from "../useHtmlRenderer.js";
import { usePdfGenerator } from "../usePdfGenerator.js";
export function useReceiptPrinting() {
  const pdfGenerator = usePdfGenerator();
  const htmlRenderer = useHtmlRenderer();
  const localError = ref(null);
  const loading = computed(() => pdfGenerator.loading.value || htmlRenderer.loading.value);
  const error = computed(
    () => localError.value || pdfGenerator.error.value || htmlRenderer.error.value
  );
  const emailReceipt = async (session, customerEmail) => {
    try {
      localError.value = null;
      const receipt = generateReceiptData(session);
      const emailData = {
        to: customerEmail,
        subject: `\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E08\u0E32\u0E01\u0E23\u0E49\u0E32\u0E19\u0E04\u0E49\u0E32 WShop - ${receipt.receiptNumber}`,
        template: "receipt",
        data: {
          receiptNumber: receipt.receiptNumber,
          date: receipt.createdAt,
          items: receipt.items,
          totals: receipt.totals,
          customer: receipt.customer
        }
      };
      console.log("Sending receipt email:", emailData);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return { success: true, message: "Receipt sent successfully" };
    } catch (err) {
      localError.value = err instanceof Error ? err.message : "Failed to send receipt email";
      throw err;
    }
  };
  return {
    loading,
    error,
    generateReceiptData,
    printReceipt: htmlRenderer.printElement,
    generatePDFReceipt: pdfGenerator.generatePDFReceipt,
    generateImageReceipt: htmlRenderer.generateImage,
    generateTaxInvoice: pdfGenerator.generateTaxInvoice,
    emailReceipt
  };
}
