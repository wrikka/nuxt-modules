export default defineEventHandler(async (_event) => {
  const stockAlerts = [
    {
      id: "alert_1",
      productId: "prod_001",
      productName: "\u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21\u0E15\u0E23\u0E32\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E",
      currentStock: 5,
      minStock: 20,
      maxStock: 100,
      alertType: "low_stock",
      severity: "high",
      message: "\u0E2A\u0E15\u0E47\u0E2D\u0E01\u0E43\u0E01\u0E25\u0E49\u0E2B\u0E21\u0E14 \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E15\u0E34\u0E21\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E19\u0E40\u0E23\u0E47\u0E27\u0E46 \u0E19\u0E35\u0E49",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1e3)
      // 30 minutes ago
    },
    {
      id: "alert_2",
      productId: "prod_002",
      productName: "\u0E02\u0E19\u0E21\u0E1B\u0E31\u0E07\u0E1B\u0E34\u0E49\u0E07",
      currentStock: 0,
      minStock: 10,
      maxStock: 50,
      alertType: "out_of_stock",
      severity: "critical",
      message: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2B\u0E21\u0E14! \u0E15\u0E49\u0E2D\u0E07\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E17\u0E31\u0E19\u0E17\u0E35",
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1e3)
      // 15 minutes ago
    },
    {
      id: "alert_3",
      productId: "prod_003",
      productName: "\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E17\u0E34\u0E0A\u0E0A\u0E39\u0E48",
      currentStock: 150,
      minStock: 20,
      maxStock: 100,
      alertType: "overstock",
      severity: "medium",
      message: "\u0E2A\u0E15\u0E47\u0E2D\u0E01\u0E40\u0E01\u0E34\u0E19\u0E02\u0E35\u0E14\u0E08\u0E33\u0E01\u0E31\u0E14 \u0E2D\u0E32\u0E08\u0E15\u0E49\u0E2D\u0E07\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32",
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3)
      // 2 hours ago
    },
    {
      id: "alert_4",
      productId: "prod_004",
      productName: "\u0E01\u0E32\u0E41\u0E1F\u0E1C\u0E07",
      currentStock: 8,
      minStock: 15,
      maxStock: 80,
      alertType: "low_stock",
      severity: "medium",
      message: "\u0E2A\u0E15\u0E47\u0E2D\u0E01\u0E15\u0E48\u0E33 \u0E04\u0E27\u0E23\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D\u0E40\u0E1E\u0E34\u0E48\u0E21",
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1e3)
      // 4 hours ago
    }
  ];
  return {
    success: true,
    data: stockAlerts
  };
});
