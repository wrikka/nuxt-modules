export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const period = query.period || "today";
  const salesByCategory = [
    {
      category: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21",
      sales: 25e3,
      quantity: 500,
      orders: 180,
      percentage: 35,
      growth: 12.5
    },
    {
      category: "\u0E02\u0E19\u0E21\u0E02\u0E1A\u0E40\u0E04\u0E35\u0E49\u0E22\u0E27",
      sales: 18e3,
      quantity: 360,
      orders: 120,
      percentage: 25,
      growth: 8.3
    },
    {
      category: "\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E1A\u0E49\u0E32\u0E19",
      sales: 15e3,
      quantity: 300,
      orders: 90,
      percentage: 21,
      growth: -2.1
    },
    {
      category: "\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E41\u0E2B\u0E49\u0E07",
      sales: 13e3,
      quantity: 260,
      orders: 75,
      percentage: 19,
      growth: 5.7
    }
  ];
  const totalSales = salesByCategory.reduce((sum, cat) => sum + cat.sales, 0);
  salesByCategory.forEach((cat) => {
    cat.percentage = Math.round(cat.sales / totalSales * 100);
  });
  return {
    success: true,
    data: {
      categories: salesByCategory,
      totalSales,
      period,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
});
