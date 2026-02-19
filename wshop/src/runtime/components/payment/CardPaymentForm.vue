<script setup lang="ts">
import type { CardPayment } from '~~/shared/types'

interface Props {
  amount: number
  loading?: boolean
}

interface Emits {
  (e: 'pay', payment: CardPayment): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { processCardPayment } = usePayment()
const {
  cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  cardHolderName,
  expiryMonthRef,
  expiryYearRef,
  cvvRef,
  isFormValid,
  cardType,
  handleCardNumberInput,
  handleExpiryMonthInput,
  handleExpiryYearInput,
  handleCvvInput,
  getFormData,
  setCardNumber,
  setExpiryMonth,
  setExpiryYear,
  setCvv,
  setCardHolderName
} = useCardForm()

const handlePay = async () => {
  if (!isFormValid.value) return
  
  try {
    const formData = getFormData()
    const payment = await processCardPayment({
      id: `payment-${Date.now()}`,
      status: 'processing',
      amount: props.amount,
      cardNumber: formData.cardNumber,
      cardType: cardType.value,
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      cvv: formData.cvv,
      orderId: `order-${Date.now()}`
    })
    
    emit('pay', payment.data || payment)
  } catch (error) {
    console.error('Failed to process card payment:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>

  <div class="bg-white rounded-lg p-6">
    <div class="flex items-center mb-6">
      <Icon name="mdi:credit-card" class="w-6 h-6 text-blue-600 mr-2" />
      <h3 class="text-lg font-semibold">ชำระเงินด้วยบัตรเครดิต</h3>
    </div>

    <!-- Amount Display -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="text-sm text-gray-600 mb-1">ยอดที่ต้องชำระ</div>
      <div class="text-2xl font-bold text-gray-900">฿{{ amount.toFixed(2) }}</div>
    </div>

    <!-- Card Number -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        หมายเลขบัตร
      </label>
      <div class="relative">
        <input
          v-model="cardNumber"
          type="text"
          maxlength="19"
          placeholder="1234 5678 9012 3456"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleCardNumberInput"
        />
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span class="text-lg">
            {{ cardType === 'visa' ? '💳' : 
               cardType === 'mastercard' ? '💳' : '💳' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Holder Name -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        ชื่อผู้ถือบัตร
      </label>
      <input
        v-model="cardHolderName"
        type="text"
        placeholder="JOHN DOE"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
      />
    </div>

    <!-- Expiry Date and CVV -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- Expiry Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <Icon name="mdi:calendar" class="inline w-4 h-4 mr-1" />
          วันหมดอายุ
        </label>
        <div class="flex space-x-2">
          <input
            ref="expiryMonthRef"
            v-model="expiryMonth"
            type="text"
            maxlength="2"
            placeholder="MM"
            class="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            @input="handleExpiryMonthInput"
          />
          <span class="self-center text-gray-500">/</span>
          <input
            ref="expiryYearRef"
            v-model="expiryYear"
            type="text"
            maxlength="2"
            placeholder="YY"
            class="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            @input="handleExpiryYearInput"
          />
        </div>
      </div>

      <!-- CVV -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <Icon name="mdi:shield-check" class="inline w-4 h-4 mr-1" />
          CVV
        </label>
        <input
          ref="cvvRef"
          v-model="cvv"
          type="text"
          maxlength="3"
          placeholder="123"
          class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
          @input="handleCvvInput"
        />
      </div>
    </div>

    <!-- Security Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
      <div class="flex items-start">
        <Icon name="mdi:shield-check" class="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div class="text-sm text-blue-800">
          <p class="font-medium mb-1">การป้องกันความปลอดภัย</p>
          <p>ข้อมูลบัตรของคุณจะถูกเข้ารหัสและปลอดภัย</p>
        </div>
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
        :disabled="!isFormValid || loading"
        class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading">กำลังดำเนินการ...</span>
        <span v-else>ชำระเงิน</span>
      </button>
    </div>
  </div>

</template>
