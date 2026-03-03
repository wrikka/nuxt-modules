<script setup lang="ts">
import type { PaymentMethod, QRCodePayment, CardPayment, CashPayment } from '#shared/types'
import { usePayment } from '~/composables/payments/usePayment'

interface Props {
  show: boolean
  amount: number
  orderId?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'success', payment: CashPayment | QRCodePayment | CardPayment): void
  (e: 'error', error: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedMethodId = ref('')
const loading = ref(false)

const { paymentMethods, loadPaymentMethods } = usePayment()

// Load payment methods on mount
onMounted(async () => {
  await loadPaymentMethods()
})

const selectedMethod = computed(() => {
  return paymentMethods.value.find((m: PaymentMethod) => m.id === selectedMethodId.value)
})

const handleMethodSelect = (method: PaymentMethod) => {
  selectedMethodId.value = method.id
}

const handlePaymentSuccess = (payment: CashPayment | QRCodePayment | CardPayment) => {
  emit('success', payment)
  emit('close')
}

const handlePaymentError = (error: string) => {
  emit('error', error)
}

const handleClose = () => {
  if (!loading.value) {
    emit('close')
  }
}

// Reset selected method when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    selectedMethodId.value = ''
  }
})
</script>

<template>

  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleClose"
    >
      <div
        class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-xl font-semibold">ชำระเงิน</h2>
          <button
            @click="handleClose"
            :disabled="loading"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Amount Display -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="text-sm text-blue-600 mb-1">ยอดที่ต้องชำระ</div>
            <div class="text-3xl font-bold text-blue-900">฿{{ amount.toFixed(2) }}</div>
          </div>

          <!-- Payment Method Selection -->
          <div v-if="!selectedMethod" class="mb-6">
            <h3 class="text-lg font-medium mb-4">เลือกวิธีการชำระเงิน</h3>
            <PaymentMethodSelector
              v-model="selectedMethodId"
              :methods="[...paymentMethods]"
              :disabled="loading"
              @select="handleMethodSelect"
            />
          </div>

          <!-- Payment Forms -->
          <div v-else>
            <!-- Back Button -->
            <button
              @click="selectedMethodId = ''"
              :disabled="loading"
              class="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
            >
              ← กลับไปเลือกวิธีการชำระเงิน
            </button>

            <!-- Cash Payment Form -->
            <CashPaymentForm
              v-if="selectedMethod.type === 'cash'"
              :amount="amount"
              :loading="loading"
              @pay="handlePaymentSuccess"
              @cancel="handleClose"
            />

            <!-- QR Payment Form -->
            <QRPaymentForm
              v-else-if="selectedMethod.type === 'qr'"
              :amount="amount"
              :loading="loading"
              @pay="handlePaymentSuccess"
              @cancel="handleClose"
            />

            <!-- Card Payment Form -->
            <CardPaymentForm
              v-else-if="selectedMethod.type === 'card'"
              :amount="amount"
              :loading="loading"
              @pay="handlePaymentSuccess"
              @cancel="handleClose"
            />

            <!-- Bank Transfer Form (Placeholder) -->
            <div v-else-if="selectedMethod.type === 'transfer'" class="text-center py-8">
              <div class="text-gray-500 mb-4">
                ฟอร์มโอนเงินผ่านธนาคารจะมาในเร็วๆ นี้
              </div>
              <button
                @click="handleClose"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

</template>
