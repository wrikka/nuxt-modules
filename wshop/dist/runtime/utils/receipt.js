export const generateReceiptData = (session) => {
  const receiptNumber = `RCP-${Date.now()}`;
  const receiptItems = session.items.map((item) => {
    const price = Number(item.price);
    const subtotal = price * item.quantity;
    const tax = subtotal * 0.07;
    return {
      productId: item.productId,
      productName: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      unitPrice: price,
      discount: 0,
      // Placeholder for item-level discount
      subtotal: Number(item.price) * item.quantity,
      tax,
      total: subtotal + tax
    };
  });
  return {
    id: session.id,
    sessionId: session.sessionId,
    receiptNumber,
    type: "sale",
    items: receiptItems,
    payments: [{
      method: session.paymentMethod,
      amount: session.total,
      reference: session.paymentDetails?.reference,
      cardType: session.paymentDetails?.cardType,
      last4: session.paymentDetails?.last4
    }],
    totals: {
      subtotal: session.subtotal,
      tax: session.tax,
      discount: 0,
      // Placeholder for item-level discount
      total: session.total,
      paid: session.paymentDetails?.cashReceived || session.total,
      change: session.paymentDetails?.change || 0
    },
    customer: {
      id: String(session.customerId) || "",
      name: session.customerId ? "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32" : "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B",
      email: "",
      phone: ""
    },
    staff: {
      id: session.staffId,
      name: "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19",
      role: "staff"
    },
    createdAt: session.createdAt
  };
};
export const getPaymentMethodName = (method) => {
  const methods = {
    cash: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14",
    card: "\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
    mobile: "Mobile Banking",
    store_credit: "\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15\u0E23\u0E49\u0E32\u0E19"
  };
  return methods[method] || method;
};
