<script setup>
import { useDashboard } from "~/composables/dashboard/useDashboard";
const {
  salesData,
  salesLoading,
  loadRealTimeSales,
  loadTopProducts,
  loadSalesByCategory,
  loadHourlySales,
  loadPaymentMethodsSummary,
  startAutoRefresh,
  stopAutoRefresh
} = useDashboard();
const topProducts = ref([]);
const salesByCategory = ref([]);
const hourlySales = ref([]);
const paymentMethods = ref([]);
const selectedPeriod = ref("today");
const isAutoRefresh = ref(true);
const currentSales = computed(() => salesData.value?.today || {});
const previousSales = computed(() => salesData.value?.previous || {});
const salesGrowth = computed(() => {
  const current = currentSales.value.total || 0;
  const previous = previousSales.value.total || 0;
  if (previous === 0) return 0;
  return (current - previous) / previous * 100;
});
const isGrowthPositive = computed(() => salesGrowth.value >= 0);
const formatCurrency = (amount = 0) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(amount);
const formatNumber = (num = 0) => new Intl.NumberFormat("th-TH").format(num);
const loadDashboardData = async () => {
  try {
    const [topProductsData, salesByCategoryData, hourlySalesData, paymentMethodsData] = await Promise.all([
      loadTopProducts(5),
      // Assuming these return the data directly now
      loadSalesByCategory(selectedPeriod.value),
      loadHourlySales(),
      loadPaymentMethodsSummary(selectedPeriod.value),
      loadRealTimeSales({ period: selectedPeriod.value })
      // This updates salesData from the composable
    ]);
    topProducts.value = topProductsData || [
      { name: "\u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21\u0E15\u0E23\u0E32\u0E2A\u0E38\u0E02\u0E20\u0E32\u0E1E", sales: 12500, quantity: 250 },
      { name: "\u0E02\u0E19\u0E21\u0E1B\u0E31\u0E07\u0E1B\u0E34\u0E49\u0E07", sales: 8900, quantity: 178 }
    ];
    salesByCategory.value = salesByCategoryData || [
      { category: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21", sales: 25e3, percentage: 35 },
      { category: "\u0E02\u0E19\u0E21\u0E02\u0E1A\u0E40\u0E04\u0E35\u0E49\u0E22\u0E27", sales: 18e3, percentage: 25 }
    ];
    hourlySales.value = hourlySalesData || [];
    paymentMethods.value = paymentMethodsData || [
      { method: "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14", amount: 35e3, percentage: 45 },
      { method: "\u0E42\u0E2D\u0E19\u0E40\u0E07\u0E34\u0E19", amount: 23e3, percentage: 30 }
    ];
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
};
const toggleAutoRefresh = () => {
  isAutoRefresh.value = !isAutoRefresh.value;
  if (isAutoRefresh.value) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
};
watch(selectedPeriod, loadDashboardData);
onMounted(loadDashboardData);
</script>

<template>
  <div class="space-y-6">
    <SalesDashboardHeader 
      v-model:selectedPeriod="selectedPeriod" 
      v-model:isAutoRefresh="isAutoRefresh"
      @toggle-auto-refresh="toggleAutoRefresh"
    />

    <div v-if="salesLoading" class="py-12 text-center">
      <div class="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="ยอดขายรวม"
          :value="formatCurrency(currentSales.total)"
          icon="mdi:currency-usd"
          icon-bg-color="bg-blue-100"
          icon-text-color="text-blue-600"
          :trend="{ value: salesGrowth, isPositive: isGrowthPositive }"
        />
        <DashboardStatCard
          title="จำนวนออเดอร์"
          :value="formatNumber(currentSales.orders)"
          icon="mdi:cart"
          icon-bg-color="bg-green-100"
          icon-text-color="text-green-600"
          :footer-text="`\u0E22\u0E2D\u0E14\u0E40\u0E09\u0E25\u0E35\u0E48\u0E22: ${formatCurrency(currentSales.total / (currentSales.orders || 1))}`"
        />
        <DashboardStatCard
          title="ลูกค้า"
          :value="formatNumber(currentSales.customers)"
          icon="mdi:account-group"
          icon-bg-color="bg-purple-100"
          icon-text-color="text-purple-600"
          :footer-text="`\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48: ${formatNumber(currentSales.newCustomers)}`"
        />
        <DashboardStatCard
          title="สินค้าขายได้"
          :value="formatNumber(currentSales.items)"
          icon="mdi:package-variant"
          icon-bg-color="bg-orange-100"
          icon-text-color="text-orange-600"
          :footer-text="`\u0E02\u0E32\u0E22\u0E44\u0E14\u0E49\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14: ${formatNumber(currentSales.uniqueProducts)} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23`"
        />
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardTopProducts :products="topProducts" />
        <DashboardSalesByCategory :sales="salesByCategory" />
      </div>

      <DashboardPaymentMethods :methods="paymentMethods" />
    </div>
  </div>
</template>
