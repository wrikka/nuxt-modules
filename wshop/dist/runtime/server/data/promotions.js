export const mockPromotions = [
  {
    id: 1,
    name: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32 20% \u0E17\u0E38\u0E01\u0E0A\u0E34\u0E49\u0E19",
    description: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32 20% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E38\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E23\u0E49\u0E32\u0E19",
    type: "percentage",
    discountValue: 20,
    usageLimit: 1e3,
    minimumAmount: 500,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
    // 30 days from now
    status: "active",
    maxUsage: 1e3,
    maxUsagePerCustomer: 5,
    usageCount: 245,
    conditions: {
      minPurchase: 500,
      minQuantity: 1,
      customerTypes: ["regular", "premium"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 2,
    name: "\u0E0B\u0E37\u0E49\u0E2D 2 \u0E41\u0E16\u0E21 1",
    description: "\u0E0B\u0E37\u0E49\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 2 \u0E0A\u0E34\u0E49\u0E19\u0E23\u0E31\u0E1A\u0E1F\u0E23\u0E35 1 \u0E0A\u0E34\u0E49\u0E19 (\u0E23\u0E32\u0E04\u0E32\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 500 \u0E1A\u0E32\u0E17)",
    type: "buy_x_get_y",
    discountValue: 2,
    usageLimit: 500,
    minimumAmount: 0,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
    // 7 days from now
    status: "active",
    maxUsage: 500,
    maxUsagePerCustomer: 3,
    usageCount: 87,
    conditions: {
      minPurchase: 0,
      minQuantity: 2,
      customerTypes: [],
      productCategories: ["\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E2D\u0E19\u0E34\u0E01\u0E2A\u0E4C", "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32"]
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 3,
    name: "\u0E2A\u0E48\u0E07\u0E1F\u0E23\u0E35\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E31\u0E49\u0E19\u0E15\u0E48\u0E33 1000 \u0E1A\u0E32\u0E17",
    description: "\u0E2A\u0E48\u0E07\u0E1F\u0E23\u0E35\u0E17\u0E31\u0E48\u0E27\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E0B\u0E37\u0E49\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E04\u0E23\u0E1A 1000 \u0E1A\u0E32\u0E17\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B",
    type: "free_shipping",
    discountValue: 0,
    usageLimit: null,
    minimumAmount: 1e3,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1e3).toISOString(),
    // 60 days from now
    status: "active",
    maxUsage: null,
    maxUsagePerCustomer: null,
    usageCount: 432,
    conditions: {
      minPurchase: 1e3,
      minQuantity: 1,
      customerTypes: ["regular", "premium", "vip"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 4,
    name: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32 15% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 VIP",
    description: "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14\u0E1E\u0E34\u0E40\u0E28\u0E29 15% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E23\u0E30\u0E14\u0E31\u0E1A VIP \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19",
    type: "percentage",
    discountValue: 15,
    usageLimit: 2e3,
    minimumAmount: 300,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1e3).toISOString(),
    // 45 days from now
    status: "active",
    maxUsage: 2e3,
    maxUsagePerCustomer: 10,
    usageCount: 156,
    conditions: {
      minPurchase: 300,
      minQuantity: 1,
      customerTypes: ["vip"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 5,
    name: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32 100 \u0E1A\u0E32\u0E17 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E31\u0E49\u0E19\u0E15\u0E48\u0E33 800 \u0E1A\u0E32\u0E17",
    description: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32\u0E15\u0E32\u0E22\u0E15\u0E31\u0E27 100 \u0E1A\u0E32\u0E17\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E0B\u0E37\u0E49\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E04\u0E23\u0E1A 800 \u0E1A\u0E32\u0E17",
    type: "fixed_amount",
    discountValue: 100,
    usageLimit: 750,
    minimumAmount: 800,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1e3).toISOString(),
    // 21 days from now
    status: "active",
    maxUsage: 750,
    maxUsagePerCustomer: 2,
    usageCount: 298,
    conditions: {
      minPurchase: 800,
      minQuantity: 1,
      customerTypes: ["regular", "premium"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 6,
    name: "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2A\u0E30\u0E2A\u0E21 2 \u0E40\u0E17\u0E48\u0E32",
    description: "\u0E23\u0E31\u0E1A\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2A\u0E30\u0E2A\u0E21 2 \u0E40\u0E17\u0E48\u0E32 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E17\u0E38\u0E01\u0E01\u0E32\u0E23\u0E0B\u0E37\u0E49\u0E2D\u0E43\u0E19\u0E0A\u0E48\u0E27\u0E07\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19",
    type: "points_multiplier",
    discountValue: 2,
    usageLimit: null,
    minimumAmount: 200,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString(),
    // 14 days from now
    status: "active",
    maxUsage: null,
    maxUsagePerCustomer: null,
    usageCount: 521,
    conditions: {
      minPurchase: 200,
      minQuantity: 1,
      customerTypes: ["regular", "premium", "vip"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 7,
    name: "Flash Sale \u0E25\u0E14 50% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01",
    description: "\u0E25\u0E14\u0E23\u0E32\u0E04\u0E32 50% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E08\u0E33\u0E01\u0E31\u0E14\u0E40\u0E27\u0E25\u0E32",
    type: "percentage",
    discountValue: 50,
    usageLimit: 100,
    minimumAmount: 100,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3).toISOString(),
    // 3 days from now
    status: "active",
    maxUsage: 100,
    maxUsagePerCustomer: 1,
    usageCount: 67,
    conditions: {
      minPurchase: 100,
      minQuantity: 1,
      customerTypes: ["regular", "premium", "vip"],
      productCategories: ["\u0E2D\u0E34\u0E40\u0E25\u0E47\u0E01\u0E17\u0E23\u0E2D\u0E19\u0E34\u0E01\u0E2A\u0E4C", "\u0E41\u0E1F\u0E0A\u0E31\u0E48\u0E19"]
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: 8,
    name: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48 \u0E25\u0E14 10%",
    description: "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14\u0E1E\u0E34\u0E40\u0E28\u0E29 10% \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48\u0E17\u0E38\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
    type: "percentage",
    discountValue: 10,
    usageLimit: 1500,
    minimumAmount: 200,
    startDate: (/* @__PURE__ */ new Date()).toISOString(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3).toISOString(),
    // 90 days from now
    status: "active",
    maxUsage: 1500,
    maxUsagePerCustomer: 5,
    usageCount: 89,
    conditions: {
      minPurchase: 200,
      minQuantity: 1,
      customerTypes: ["regular", "premium", "vip"],
      productCategories: []
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
