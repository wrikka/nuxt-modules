export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = parseInt(query.limit) || 10;
  const topProducts = [
    {
      id: "prod_001",
      name: "\u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21\u0E15\u0E23\u0E32\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E",
      category: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21",
      sales: 12500,
      quantity: 250,
      averagePrice: 50,
      growth: 15.5
    },
    {
      id: "prod_002",
      name: "\u0E02\u0E19\u0E21\u0E1B\u0E31\u0E07\u0E1B\u0E34\u0E49\u0E07",
      category: "\u0E02\u0E19\u0E21\u0E02\u0E1A\u0E40\u0E04\u0E35\u0E49\u0E22\u0E27",
      sales: 8900,
      quantity: 178,
      averagePrice: 50,
      growth: 8.2
    },
    {
      id: "prod_003",
      name: "\u0E01\u0E32\u0E41\u0E1F\u0E1C\u0E07",
      category: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21",
      sales: 6700,
      quantity: 134,
      averagePrice: 50,
      growth: -2.1
    },
    {
      id: "prod_004",
      name: "\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E17\u0E34\u0E0A\u0E0A\u0E39\u0E48",
      category: "\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E1A\u0E49\u0E32\u0E19",
      sales: 4500,
      quantity: 90,
      averagePrice: 50,
      growth: 5.8
    },
    {
      id: "prod_005",
      name: "\u0E19\u0E49\u0E33\u0E22\u0E32\u0E25\u0E49\u0E32\u0E07\u0E08\u0E32\u0E19",
      category: "\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E1A\u0E49\u0E32\u0E19",
      sales: 3200,
      quantity: 64,
      averagePrice: 50,
      growth: 12.3
    },
    {
      id: "prod_006",
      name: "\u0E21\u0E32\u0E21\u0E48\u0E32",
      category: "\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E41\u0E2B\u0E49\u0E07",
      sales: 2800,
      quantity: 56,
      averagePrice: 50,
      growth: 3.7
    },
    {
      id: "prod_007",
      name: "\u0E19\u0E49\u0E33\u0E1B\u0E25\u0E32",
      category: "\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E41\u0E2B\u0E49\u0E07",
      sales: 2400,
      quantity: 48,
      averagePrice: 50,
      growth: -1.5
    },
    {
      id: "prod_008",
      name: "\u0E2A\u0E1A\u0E39\u0E48",
      category: "\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E1A\u0E49\u0E32\u0E19",
      sales: 2100,
      quantity: 42,
      averagePrice: 50,
      growth: 7.9
    },
    {
      id: "prod_009",
      name: "\u0E22\u0E32\u0E2A\u0E35\u0E1F\u0E31\u0E19",
      category: "\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27",
      sales: 1900,
      quantity: 38,
      averagePrice: 50,
      growth: 4.2
    },
    {
      id: "prod_010",
      name: "\u0E0A\u0E32\u0E40\u0E22\u0E47\u0E19",
      category: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21",
      sales: 1700,
      quantity: 34,
      averagePrice: 50,
      growth: 9.6
    }
  ].slice(0, limit);
  return {
    success: true,
    data: topProducts
  };
});
