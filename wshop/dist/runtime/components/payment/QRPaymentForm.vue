<script setup>
import { useQRPaymentForm } from "~/composables/payment/useQRPaymentForm";
const props = defineProps({
  amount: { type: Number, required: true },
  loading: { type: Boolean, required: false }
});
const emit = defineEmits(["pay", "cancel"]);
const { generateQRPayment, checkQRPaymentStatus, startQRStatusCheck } = usePayment();
const {
  selectedProvider,
  qrPayment,
  timeRemaining,
  providers,
  setSelectedProvider,
  setQRPayment,
  setStatusCheckInterval
} = useQRPaymentForm();
const generateQR = async () => {
  try {
    const payment = await generateQRPayment(props.amount, selectedProvider.value);
    setQRPayment(payment);
    const handleStatusChange = (status) => {
      if (status === "paid") {
        emit("pay", payment);
      }
    };
    const interval = startQRStatusCheck(payment.id, handleStatusChange);
    setStatusCheckInterval(interval);
  } catch (error) {
    console.error("Failed to generate QR payment:", error);
  }
};
const cancelPayment = () => {
  setStatusCheckInterval(null);
  emit("cancel");
};
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex items-center mb-6">
      <Icon name="mdi:cellphone" class="w-6 h-6 text-blue-600 mr-2" />
      <h3 class="text-lg font-semibold">ชำระเงินผ่าน QR Code</h3>
    </div>

    <!-- Amount Display -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="text-sm text-gray-600 mb-1">ยอดที่ต้องชำระ</div>
      <div class="text-2xl font-bold text-gray-900">฿{{ amount.toFixed(2) }}</div>
    </div>

    <!-- Provider Selection -->
    <div v-if="!qrPayment" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        เลือกผู้ให้บริการ
      </label>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="provider in providers"
          :key="provider.id"
          @click="setSelectedProvider(provider.id)"
          :class="[
  'p-3 border rounded-lg cursor-pointer transition-colors',
  selectedProvider === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
]"
        >
          <div class="flex items-center">
            <span class="text-2xl mr-3">{{ provider.icon }}</span>
            <span class="font-medium">{{ provider.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Display -->
    <div v-if="qrPayment" class="text-center">
      <!-- Status -->
      <div class="mb-4">
        <div class="flex items-center justify-center">
          <Icon name="mdi:check-circle" 
            v-if="qrPayment.status === 'paid'"
            class="w-8 h-8 text-green-600 mr-2"
          />
          <Icon name="mdi:close-circle" 
            v-else-if="qrPayment.status === 'expired'"
            class="w-8 h-8 text-red-600 mr-2"
          />
          <Icon name="mdi:clock" 
            v-else
            class="w-8 h-8 text-blue-600 mr-2"
          />
          <span class="text-lg font-medium">
            {{ 
              qrPayment.status === "paid" ? "\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : qrPayment.status === "expired" ? "\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38" : "\u0E23\u0E2D\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19"
            }}
          </span>
        </div>
      </div>

      <!-- QR Code -->
      <div v-if="qrPayment.status !== 'paid' && qrPayment.status !== 'expired'" class="mb-4">
        <div class="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
          <img 
            :src="qrPayment.qrCode" 
            alt="QR Code"
            class="w-64 h-64"
          />
        </div>
      </div>

      <!-- Time Remaining -->
      <div v-if="qrPayment.status !== 'paid' && qrPayment.status !== 'expired'" class="mb-4">
        <div class="flex items-center justify-center text-sm text-gray-600">
          <Icon name="mdi:clock" class="w-4 h-4 mr-1" />
          หมดอายุใน: {{ timeRemaining }}
        </div>
      </div>

      <!-- Instructions -->
      <div class="text-sm text-gray-600 mb-6">
        <p>1. เปิดแอปพลิเคชันของผู้ให้บริการที่เลือก</p>
        <p>2. สแกน QR Code หรือบันทึกรูปภาพ</p>
        <p>3. ยืนยันการชำระเงิน</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="cancelPayment"
        class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        {{ qrPayment ? "\u0E1B\u0E34\u0E14" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" }}
      </button>
      <button
        v-if="!qrPayment"
        @click="generateQR"
        :disabled="loading"
        class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading">กำลังสร้าง QR...</span>
        <span v-else>สร้าง QR Code</span>
      </button>
    </div>
  </div>
</template>
