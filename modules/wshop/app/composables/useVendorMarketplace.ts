import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface Vendor {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  email: string
  phone: string
  address: string
  commissionRate: number
  rating: number
  totalSales: number
  productsCount: number
  status: "active" | "pending" | "suspended"
  verified: boolean
  joinedAt: Date
  settings: {
    autoApproveProducts: boolean
    shippingMethods: string[]
    paymentMethods: string[]
  }
}

export interface VendorProduct extends Product {
  vendorId: string
  vendorName: string
  vendorCommission: number
}

export interface VendorOrder {
  id: string
  vendorId: string
  orderId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    commission: number
  }>
  total: number
  commission: number
  vendorPayout: number
  status: "pending" | "processing" | "shipped" | "delivered"
  createdAt: Date
}

export interface VendorPayout {
  id: string
  vendorId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  method: "bank_transfer" | "paypal" | "stripe"
  requestedAt: Date
  processedAt?: Date
  orders: string[]
}

export const useVendorMarketplace = () => {
  const vendors = ref<Vendor[]>([])
  const currentVendor = ref<Vendor | null>(null)
  const vendorProducts = ref<VendorProduct[]>([])
  const vendorOrders = ref<VendorOrder[]>([])
  const payouts = ref<VendorPayout[]>([])
  const loading = ref(false)

  const fetchVendors = async (params?: {
    status?: string
    verified?: boolean
    search?: string
  }): Promise<Vendor[]> => {
    loading.value = true
    try {
      const data = await $fetch<Vendor[]>("/api/shop/vendors", { params })
      vendors.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const fetchVendor = async (slug: string): Promise<Vendor> => {
    loading.value = true
    try {
      const data = await $fetch<Vendor>(`/api/shop/vendors/${slug}`)
      currentVendor.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const registerVendor = async (vendorData: Omit<Vendor, "id" | "joinedAt" | "rating" | "totalSales" | "productsCount">): Promise<Vendor> => {
    const data = await $fetch<Vendor>("/api/shop/vendors", {
      method: "POST",
      body: vendorData,
    })
    vendors.value.push(data)
    return data
  }

  const updateVendor = async (vendorId: string, updates: Partial<Vendor>): Promise<Vendor> => {
    const data = await $fetch<Vendor>(`/api/shop/vendors/${vendorId}`, {
      method: "PUT",
      body: updates,
    })

    const index = vendors.value.findIndex(v => v.id === vendorId)
    if (index !== -1) {
      vendors.value[index] = { ...vendors.value[index], ...data }
    }

    return data
  }

  const fetchVendorProducts = async (vendorId: string): Promise<VendorProduct[]> => {
    const data = await $fetch<VendorProduct[]>(`/api/shop/vendors/${vendorId}/products`)
    vendorProducts.value = data
    return data
  }

  const addVendorProduct = async (
    vendorId: string,
    product: Omit<VendorProduct, "id" | "vendorId" | "vendorName" | "vendorCommission">,
  ): Promise<VendorProduct> => {
    const data = await $fetch<VendorProduct>(`/api/shop/vendors/${vendorId}/products`, {
      method: "POST",
      body: product,
    })
    vendorProducts.value.push(data)
    return data
  }

  const fetchVendorOrders = async (vendorId: string): Promise<VendorOrder[]> => {
    const data = await $fetch<VendorOrder[]>(`/api/shop/vendors/${vendorId}/orders`)
    vendorOrders.value = data
    return data
  }

  const updateVendorOrderStatus = async (
    vendorId: string,
    orderId: string,
    status: VendorOrder["status"],
  ): Promise<VendorOrder> => {
    const data = await $fetch<VendorOrder>(`/api/shop/vendors/${vendorId}/orders/${orderId}`, {
      method: "PUT",
      body: { status },
    })

    const index = vendorOrders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      vendorOrders.value[index] = data
    }

    return data
  }

  const requestPayout = async (vendorId: string, amount: number, method: VendorPayout["method"]): Promise<VendorPayout> => {
    const data = await $fetch<VendorPayout>(`/api/shop/vendors/${vendorId}/payouts`, {
      method: "POST",
      body: { amount, method },
    })
    payouts.value.push(data)
    return data
  }

  const fetchPayouts = async (vendorId: string): Promise<VendorOrder[]> => {
    const data = await $fetch<VendorPayout[]>(`/api/shop/vendors/${vendorId}/payouts`)
    payouts.value = data
    return data
  }

  const getVendorStats = async (vendorId: string): Promise<{
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    conversionRate: number
    topProducts: Array<{ productId: string; name: string; sales: number }>
  }> => {
    return await $fetch(`/api/shop/vendors/${vendorId}/stats`)
  }

  const searchVendorProducts = async (vendorId: string, query: string): Promise<VendorProduct[]> => {
    return await $fetch<VendorProduct[]>(`/api/shop/vendors/${vendorId}/products/search`, {
      params: { q: query },
    })
  }

  const topVendors = computed(() =>
    [...vendors.value].sort((a, b) => b.totalSales - a.totalSales).slice(0, 10),
  )

  const verifiedVendors = computed(() =>
    vendors.value.filter(v => v.verified),
  )

  return {
    vendors: computed(() => vendors.value),
    currentVendor: computed(() => currentVendor.value),
    vendorProducts: computed(() => vendorProducts.value),
    vendorOrders: computed(() => vendorOrders.value),
    payouts: computed(() => payouts.value),
    loading: computed(() => loading.value),
    topVendors,
    verifiedVendors,
    fetchVendors,
    fetchVendor,
    registerVendor,
    updateVendor,
    fetchVendorProducts,
    addVendorProduct,
    fetchVendorOrders,
    updateVendorOrderStatus,
    requestPayout,
    fetchPayouts,
    getVendorStats,
    searchVendorProducts,
  }
}
