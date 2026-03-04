import { ref, computed } from "vue"
import type { Order } from "~~/types"

export interface Affiliate {
  id: string
  userId: string
  code: string
  status: "pending" | "active" | "suspended" | "banned"
  commissionRate: number
  totalEarnings: number
  totalReferrals: number
  totalSales: number
  balance: number
  paymentMethod: "bank_transfer" | "paypal" | "crypto"
  paymentDetails: Record<string, string>
  referralUrl: string
  createdAt: Date
  lastReferralAt?: Date
}

export interface Referral {
  id: string
  affiliateId: string
  customerId: string
  orderId: string
  order: Order
  commission: number
  status: "pending" | "approved" | "paid" | "rejected"
  createdAt: Date
  processedAt?: Date
}

export interface AffiliatePayout {
  id: string
  affiliateId: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  method: string
  requestedAt: Date
  processedAt?: Date
  referrals: string[]
}

export interface AffiliateLink {
  id: string
  affiliateId: string
  url: string
  shortUrl: string
  campaign?: string
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number
  commission: number
  createdAt: Date
}

export const useAffiliateSystem = () => {
  const affiliate = ref<Affiliate | null>(null)
  const referrals = ref<Referral[]>([])
  const links = ref<AffiliateLink[]>([])
  const payouts = ref<AffiliatePayout[]>([])
  const stats = ref({
    todayClicks: 0,
    todayConversions: 0,
    todayRevenue: 0,
    monthClicks: 0,
    monthConversions: 0,
    monthRevenue: 0,
    monthCommission: 0,
  })
  const loading = ref(false)

  const registerAffiliate = async (data: {
    userId: string
    paymentMethod: string
    paymentDetails: Record<string, string>
  }): Promise<Affiliate> => {
    loading.value = true
    try {
      const aff = await $fetch<Affiliate>("/api/shop/affiliates", {
        method: "POST",
        body: data,
      })
      affiliate.value = aff
      return aff
    } finally {
      loading.value = false
    }
  }

  const fetchAffiliate = async (userId: string): Promise<Affiliate> => {
    loading.value = true
    try {
      const aff = await $fetch<Affiliate>(`/api/shop/affiliates/${userId}`)
      affiliate.value = aff
      return aff
    } finally {
      loading.value = false
    }
  }

  const generateReferralLink = async (campaign?: string): Promise<AffiliateLink> => {
    const link = await $fetch<AffiliateLink>("/api/shop/affiliates/links", {
      method: "POST",
      body: { affiliateId: affiliate.value?.id, campaign },
    })
    links.value.push(link)
    return link
  }

  const fetchLinks = async (): Promise<AffiliateLink[]> => {
    const data = await $fetch<AffiliateLink[]>("/api/shop/affiliates/links")
    links.value = data
    return data
  }

  const trackClick = async (linkId: string): Promise<void> => {
    await $fetch(`/api/shop/affiliates/links/${linkId}/click`, {
      method: "POST",
    })
  }

  const fetchReferrals = async (status?: string): Promise<Referral[]> => {
    const data = await $fetch<Referral[]>("/api/shop/affiliates/referrals", {
      params: { status },
    })
    referrals.value = data
    return data
  }

  const requestPayout = async (amount: number): Promise<AffiliatePayout> => {
    const payout = await $fetch<AffiliatePayout>("/api/shop/affiliates/payouts", {
      method: "POST",
      body: {
        affiliateId: affiliate.value?.id,
        amount,
        method: affiliate.value?.paymentMethod,
      },
    })
    payouts.value.push(payout)
    return payout
  }

  const fetchPayouts = async (): Promise<AffiliatePayout[]> => {
    const data = await $fetch<AffiliatePayout[]>("/api/shop/affiliates/payouts")
    payouts.value = data
    return data
  }

  const getReferralCode = (): string => {
    return affiliate.value?.code || ""
  }

  const getReferralUrl = (productPath?: string): string => {
    const baseUrl = affiliate.value?.referralUrl || ""
    if (!productPath) return baseUrl

    const url = new URL(baseUrl)
    url.pathname = productPath
    return url.toString()
  }

  const fetchStats = async (period: "day" | "week" | "month" = "month"): Promise<typeof stats.value> => {
    const data = await $fetch<typeof stats.value>("/api/shop/affiliates/stats", {
      params: { period },
    })
    stats.value = data
    return data
  }

  const getLeaderboard = async (limit = 10): Promise<Array<{
    rank: number
    affiliateId: string
    name: string
    referrals: number
    revenue: number
    commission: number
  }>> => {
    return await $fetch("/api/shop/affiliates/leaderboard", {
      params: { limit },
    })
  }

  const isAffiliate = computed(() => affiliate.value?.status === "active")

  const canRequestPayout = computed(() =>
    (affiliate.value?.balance || 0) >= 50, // Minimum payout threshold
  )

  const pendingCommission = computed(() =>
    referrals.value
      .filter(r => r.status === "pending")
      .reduce((sum, r) => sum + r.commission, 0),
  )

  const approvedCommission = computed(() =>
    referrals.value
      .filter(r => r.status === "approved")
      .reduce((sum, r) => sum + r.commission, 0),
  )

  const totalClicks = computed(() =>
    links.value.reduce((sum, l) => sum + l.clicks, 0),
  )

  const totalConversions = computed(() =>
    links.value.reduce((sum, l) => sum + l.conversions, 0),
  )

  const conversionRate = computed(() => {
    const clicks = totalClicks.value
    if (clicks === 0) return 0
    return (totalConversions.value / clicks) * 100
  })

  return {
    affiliate: computed(() => affiliate.value),
    referrals: computed(() => referrals.value),
    links: computed(() => links.value),
    payouts: computed(() => payouts.value),
    stats: computed(() => stats.value),
    loading: computed(() => loading.value),
    isAffiliate,
    canRequestPayout,
    pendingCommission,
    approvedCommission,
    totalClicks,
    totalConversions,
    conversionRate,
    registerAffiliate,
    fetchAffiliate,
    generateReferralLink,
    fetchLinks,
    trackClick,
    fetchReferrals,
    requestPayout,
    fetchPayouts,
    getReferralCode,
    getReferralUrl,
    fetchStats,
    getLeaderboard,
  }
}
