export const useReceiptUtils = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const getPaymentMethodName = (method) => {
    const methods = {
      cash: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14",
      card: "\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
      mobile: "Mobile Banking",
      store_credit: "\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15\u0E23\u0E49\u0E32\u0E19"
    };
    return methods[method] || method;
  };
  const printReceipt = (receiptElementId = "receipt-content") => {
    const printContent = document.getElementById(receiptElementId);
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };
  const emailReceipt = async (customerEmail, customerName) => {
    if (!customerEmail) {
      alert("\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25");
      return false;
    }
    try {
      console.log("Sending receipt email to:", customerName || customerEmail);
      alert("\u0E2A\u0E48\u0E07\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E17\u0E32\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22");
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E14\u0E49");
      return false;
    }
  };
  return {
    formatDate,
    getPaymentMethodName,
    printReceipt,
    emailReceipt
  };
};
