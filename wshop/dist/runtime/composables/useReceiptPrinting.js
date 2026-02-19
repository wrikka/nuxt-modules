import { ref } from "vue";
export function useReceiptPrinting() {
  const printing = ref(false);
  const error = ref(null);
  const printReceipt = async (session) => {
    printing.value = true;
    error.value = null;
    try {
      console.log("Printing receipt for session:", session.id);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return { success: true };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to print receipt";
      throw err;
    } finally {
      printing.value = false;
    }
  };
  const generateReceiptData = (session) => {
    return {
      sessionId: session.sessionId,
      items: session.items,
      subtotal: session.subtotal,
      tax: session.tax,
      discount: session.discount,
      total: session.total,
      paymentMethod: session.paymentMethod,
      paymentReference: session.paymentDetails?.reference,
      customer: session.customerId,
      staff: session.staffId,
      register: session.registerId,
      createdAt: session.createdAt,
      completedAt: session.completedAt
    };
  };
  return {
    printing,
    error,
    printReceipt,
    generateReceiptData
  };
}
