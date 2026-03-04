import { ref, computed } from "vue"
import type { Product } from "~~/types"

export interface BNPLProvider {
  id: string
  name: string
  logo: string
  enabled: boolean
  minAmount: number
  maxAmount: number
  installmentOptions: number[]
  interestRate: number
  processingFee: number
}

export interface BNPLPlan {
  providerId: string
  providerName: string
  totalAmount: number
  installmentCount: number
  installmentAmount: number
  processingFee: number
  totalCost: number
  firstPaymentDate: Date
  schedule: Array<{
    installmentNumber: number
    dueDate: Date
    amount: number
    status: "pending" | "paid" | "overdue"
  }>
}

export interface BNPLApplication {
  id: string
  orderId: string
  providerId: string
  plan: BNPLPlan
  status: "pending" | "approved" | "rejected" | "active" | "completed"
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: Date
    idNumber: string
  }
  createdAt: Date
  approvedAt?: Date
}

export const useBNPL = () => {
  const providers = ref<BNPLProvider[]>([])
  const selectedPlan = ref<BNPLPlan | null>(null)
  const application = ref<BNPLApplication | null>(null)
  const loading = ref(false)

  const fetchProviders = async (): Promise<BNPLProvider[]> => {
    loading.value = true
    try {
      const data = await $fetch<BNPLProvider[]>("/api/shop/bnpl/providers")
      providers.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  const calculateInstallments = async (
    amount: number,
    providerId: string,
    installments: number,
  ): Promise<BNPLPlan> => {
    const plan = await $fetch<BNPLPlan>("/api/shop/bnpl/calculate", {
      method: "POST",
      body: {
        amount,
        providerId,
        installments,
      },
    })
    selectedPlan.value = plan
    return plan
  }

  const applyForBNPL = async (
    orderId: string,
    plan: BNPLPlan,
    customerInfo: BNPLApplication["customerInfo"],
  ): Promise<BNPLApplication> => {
    loading.value = true
    try {
      const app = await $fetch<BNPLApplication>("/api/shop/bnpl/apply", {
        method: "POST",
        body: {
          orderId,
          providerId: plan.providerId,
          plan,
          customerInfo,
        },
      })
      application.value = app
      return app
    } finally {
      loading.value = false
    }
  }

  const checkApplicationStatus = async (applicationId: string): Promise<BNPLApplication> => {
    const app = await $fetch<BNPLApplication>(`/api/shop/bnpl/applications/${applicationId}`)
    application.value = app
    return app
  }

  const getPaymentSchedule = async (applicationId: string): Promise<BNPLPlan["schedule"]> => {
    return await $fetch(`/api/shop/bnpl/applications/${applicationId}/schedule`)
  }

  const makeInstallmentPayment = async (
    applicationId: string,
    installmentNumber: number,
    paymentMethod: string,
  ): Promise<void> => {
    await $fetch(`/api/shop/bnpl/applications/${applicationId}/pay`, {
      method: "POST",
      body: {
        installmentNumber,
        paymentMethod,
      },
    })
  }

  const isBNPLEligible = (amount: number): boolean => {
    const enabledProviders = providers.value.filter(p => p.enabled)
    return enabledProviders.some(
      p => amount >= p.minAmount && amount <= p.maxAmount,
    )
  }

  const getAvailableInstallments = (amount: number): number[] => {
    const enabledProviders = providers.value.filter(p => p.enabled)
    const allOptions = enabledProviders.flatMap(p => p.installmentOptions)
    return [...new Set(allOptions)].sort((a, b) => a - b)
  }

  const getBestProvider = (amount: number): BNPLProvider | null => {
    const eligible = providers.value.filter(
      p => p.enabled && amount >= p.minAmount && amount <= p.maxAmount,
    )

    if (eligible.length === 0) return null

    // Sort by lowest total cost (interest + fees)
    return eligible.sort((a, b) => {
      const costA = amount * (1 + a.interestRate / 100) + a.processingFee
      const costB = amount * (1 + b.interestRate / 100) + b.processingFee
      return costA - costB
    })[0]
  }

  const cancelApplication = async (applicationId: string): Promise<void> => {
    await $fetch(`/api/shop/bnpl/applications/${applicationId}/cancel`, {
      method: "POST",
    })
  }

  const getBNPLStats = async (): Promise<{
    totalActive: number
    totalCompleted: number
    totalAmount: number
    defaultRate: number
  }> => {
    return await $fetch("/api/shop/bnpl/stats")
  }

  return {
    providers: computed(() => providers.value),
    selectedPlan: computed(() => selectedPlan.value),
    application: computed(() => application.value),
    loading: computed(() => loading.value),
    fetchProviders,
    calculateInstallments,
    applyForBNPL,
    checkApplicationStatus,
    getPaymentSchedule,
    makeInstallmentPayment,
    isBNPLEligible,
    getAvailableInstallments,
    getBestProvider,
    cancelApplication,
    getBNPLStats,
  }
}
