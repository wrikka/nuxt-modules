<script setup lang="ts">
import type { CashPayment } from '~~/shared/types'

interface Props {
  amount: number
  loading?: boolean
}

interface Emits {
  (e: 'pay', payment: { amount: number; cashReceived: number }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cashReceived = ref<number>(props.amount)
const change = computed(() => Math.max(0, cashReceived.value - props.amount))

const quickAmounts = computed(() => {
  const amounts = []
  const base = Math.ceil(props.amount / 100) * 100
  
  // Add common denominations
  for (let i = 0; i < 5; i++) {
    amounts.push(base + (i * 100))
  }
  
  return amounts
})

const setCashReceived = (amount: number) => {
  cashReceived.value = amount
}

const handlePay = () => {
  if (cashReceived.value >= props.amount) {
    emit('pay', {
      amount: props.amount,
      cashReceived: cashReceived.value
    })
  }
}

const handleCancel = () => {
  emit('cancel')
}

// Auto-set cash received when amount changes
watch(() => props.amount, (newAmount) => {
  if (cashReceived.value < newAmount) {
    cashReceived.value = newAmount
  }
})
</script>

<template>

  <div class="bg-white rounded-lg p-6">
    <div class="flex items-center mb-6">
      <Icon name="mdi:currency-usd" class="w-6 h-6 text-green-600 mr-2" />
      <h3 class="text-lg font-semibold">ชำระเงินสด</h3>
    </div>

    <!-- Amount Display -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="text-sm text-gray-600 mb-1">ยอดที่ต้องชำระ</div>
      <div class="text-2xl font-bold text-gray-900">฿{{ amount.toFixed(2) }}</div>
    </div>

    <!-- Cash Input -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        จำนวนเงินที่รับมา
      </label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          ฿
        </span>
        <input
          v-model.number="cashReceived"
          type="number"
          step="0.01"
          min="0"
          class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
          placeholder="0.00"
        />
      </div>
    </div>

    <!-- Change Display -->
    <div v-if="change > 0" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="mdi:calculator" class="w-5 h-5 text-green-600 mr-2" />
          <span class="text-sm font-medium text-green-800">เงินทอน</span>
        </div>
        <div class="text-lg font-bold text-green-600">฿{{ change.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Quick Amount Buttons -->
    <div class="mb-6">
      <div class="text-sm text-gray-600 mb-2">จำนวนเงินที่ใช้บ่อย</div>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="quickAmount in quickAmounts"
          :key="quickAmount"
          @click="setCashReceived(quickAmount)"
          class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
        >
          ฿{{ quickAmount }}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="handleCancel"
        class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ยกเลิก
      </button>
      <button
        @click="handlePay"
        :disabled="cashReceived < amount || loading"
        class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading">กำลังดำเนินการ...</span>
        <span v-else>ชำระเงิน</span>
      </button>
    </div>
  </div>

</template>
