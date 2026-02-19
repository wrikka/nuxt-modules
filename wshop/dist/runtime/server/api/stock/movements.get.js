export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const stockMovements = [
    {
      id: "movement_1",
      productId: "prod_001",
      type: "out",
      quantity: 5,
      reason: "\u0E02\u0E32\u0E22\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32",
      reference: "INV-001",
      userId: "user_001",
      createdAt: new Date(Date.now() - 30 * 60 * 1e3)
    },
    {
      id: "movement_2",
      productId: "prod_002",
      type: "in",
      quantity: 50,
      reason: "\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48",
      reference: "PO-001",
      userId: "user_001",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3)
    },
    {
      id: "movement_3",
      productId: "prod_003",
      type: "adjust",
      quantity: -10,
      reason: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E2A\u0E35\u0E22\u0E2B\u0E32\u0E22",
      userId: "user_002",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1e3)
    },
    {
      id: "movement_4",
      productId: "prod_004",
      type: "transfer",
      quantity: 20,
      reason: "\u0E42\u0E2D\u0E19\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E2A\u0E32\u0E02\u0E32\u0E2D\u0E37\u0E48\u0E19",
      reference: "TRF-001",
      userId: "user_001",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1e3)
    }
  ];
  let filteredMovements = stockMovements;
  if (query.productId) {
    filteredMovements = filteredMovements.filter((m) => m.productId === query.productId);
  }
  if (query.type) {
    filteredMovements = filteredMovements.filter((m) => m.type === query.type);
  }
  return {
    success: true,
    data: filteredMovements
  };
});
