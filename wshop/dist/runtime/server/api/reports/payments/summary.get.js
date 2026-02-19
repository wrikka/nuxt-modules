export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const period = query.period || "today";
  const paymentMethods = [
    {
      method: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14",
      type: "cash",
      amount: 35e3,
      count: 120,
      percentage: 45,
      averageAmount: 291.67,
      growth: 5.2
    },
    {
      method: "\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19",
      type: "transfer",
      amount: 23e3,
      count: 85,
      percentage: 30,
      averageAmount: 270.59,
      growth: 12.8
    },
    {
      method: "\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
      type: "card",
      amount: 15e3,
      count: 45,
      percentage: 19,
      averageAmount: 333.33,
      growth: -3.5
    },
    {
      method: "QR Code",
      type: "qr",
      amount: 4e3,
      count: 25,
      percentage: 6,
      averageAmount: 160,
      growth: 25
    }
  ];
  const totalAmount = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
  paymentMethods.forEach((method) => {
    method.percentage = Math.round(method.amount / totalAmount * 100);
  });
  return {
    success: true,
    data: {
      paymentMethods,
      totalAmount,
      totalTransactions: paymentMethods.reduce((sum, method) => sum + method.count, 0),
      period,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});
