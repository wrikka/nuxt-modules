<script setup lang="ts">
import { useDashboard } from '~/composables/dashboard/useDashboard';

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
} = useDashboard()

// Local state for fetched data
const topProducts = ref<any[]>([])
const salesByCategory = ref<any[]>([])
const hourlySales = ref<any[]>([])
const paymentMethods = ref<any[]>([])

// UI state
const selectedPeriod = ref<'today' | 'week' | 'month' | 'year'>('today')
const isAutoRefresh = ref(true)

// Computed properties for sales overview
const currentSales = computed(() => salesData.value?.today || {})
const previousSales = computed(() => salesData.value?.previous || {})

const salesGrowth = computed(() => {
  const current = currentSales.value.total || 0
  const previous = previousSales.value.total || 0
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
})

const isGrowthPositive = computed(() => salesGrowth.value >= 0)

// Formatting functions (could be moved to a util file)
const formatCurrency = (amount: number = 0) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
const formatNumber = (num: number = 0) => new Intl.NumberFormat('th-TH').format(num)

// Data loading logic
const loadDashboardData = async () => {
  try {
    const [topProductsData, salesByCategoryData, hourlySalesData, paymentMethodsData] = await Promise.all([
      loadTopProducts(5), // Assuming these return the data directly now
      loadSalesByCategory(selectedPeriod.value),
      loadHourlySales(),
      loadPaymentMethodsSummary(selectedPeriod.value),
      loadRealTimeSales({ period: selectedPeriod.value }), // This updates salesData from the composable
    ])

    // Mock data assignment, replace with actual data from API calls
    topProducts.value = topProductsData || [
      { name: 'น้ำดื่มตราสุขภาพ', sales: 12500, quantity: 250 },
      { name: 'ขนมปังปิ้ง', sales: 8900, quantity: 178 },
    ];
    salesByCategory.value = salesByCategoryData || [
      { category: 'เครื่องดื่ม', sales: 25000, percentage: 35 },
      { category: 'ขนมขบเคี้ยว', sales: 18000, percentage: 25 },
    ];
    hourlySales.value = hourlySalesData || []; // Add logic for hourly sales chart if needed
    paymentMethods.value = paymentMethodsData || [
      { method: 'เงินสด', amount: 35000, percentage: 45 },
      { method: 'โอนเงิน', amount: 23000, percentage: 30 },
    ];

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

// UI interaction handlers
const toggleAutoRefresh = () => {
  isAutoRefresh.value = !isAutoRefresh.value
  if (isAutoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// Lifecycle and watchers
watch(selectedPeriod, loadDashboardData)
onMounted(loadDashboardData)
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
          :footer-text="`ยอดเฉลี่ย: ${formatCurrency(currentSales.total / (currentSales.orders || 1))}`"
        />
        <DashboardStatCard
          title="ลูกค้า"
          :value="formatNumber(currentSales.customers)"
          icon="mdi:account-group"
          icon-bg-color="bg-purple-100"
          icon-text-color="text-purple-600"
          :footer-text="`ลูกค้าใหม่: ${formatNumber(currentSales.newCustomers)}`"
        />
        <DashboardStatCard
          title="สินค้าขายได้"
          :value="formatNumber(currentSales.items)"
          icon="mdi:package-variant"
          icon-bg-color="bg-orange-100"
          icon-text-color="text-orange-600"
          :footer-text="`ขายได้ทั้งหมด: ${formatNumber(currentSales.uniqueProducts)} รายการ`"
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
