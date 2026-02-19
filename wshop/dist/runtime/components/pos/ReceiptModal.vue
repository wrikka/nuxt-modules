<script setup>
import { useReceiptUtils } from "~/composables/pos/useReceiptUtils";
const props = defineProps({
  sale: { type: null, required: true }
});
const emit = defineEmits(["close", "print"]);
const staffName = "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19 1";
const customerName = "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 1";
const {
  formatDate,
  getPaymentMethodName,
  printReceipt,
  emailReceipt
} = useReceiptUtils();
const handlePrintReceipt = () => {
  printReceipt("receipt-content");
  emit("print");
};
const handleEmailReceipt = async () => {
  await emailReceipt(props.sale?.customerEmail, customerName);
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">ใบเสร็จ</h3>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg"
        >
          <NuxtIcon name="i-mdi-close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Receipt Content -->
      <div id="receipt-content" class="bg-white p-4 border-2 border-dashed border-gray-300">
        <div class="text-center mb-4">
          <h2 class="text-xl font-bold">ร้านค้า WShop</h2>
          <p class="text-sm text-gray-600">123 ถนนสุขุมวิทย์ กรุงเทพฯ</p>
          <p class="text-sm text-gray-600">โทร: 02-123-4567</p>
        </div>

        <div class="border-t border-b border-gray-300 py-2 mb-4">
          <div class="flex justify-between text-sm mb-1">
            <span>เลขที่:</span>
            <span>{{ sale?.sessionId }}</span>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <span>วันที่:</span>
            <span>{{ formatDate(sale?.createdAt) }}</span>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <span>พนักงาน:</span>
            <span>{{ staffName }}</span>
          </div>
          <div v-if="sale?.customerId" class="flex justify-between text-sm">
            <span>ลูกค้า:</span>
            <span>{{ customerName }}</span>
          </div>
        </div>

        <div class="mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-1">รายการ</th>
                <th class="text-center py-1">จำนวน</th>
                <th class="text-right py-1">ราคา</th>
                <th class="text-right py-1">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sale?.items" :key="item.productId" class="border-b">
                <td class="py-1">{{ item.product?.name }}</td>
                <td class="text-center py-1">{{ item.quantity }}</td>
                <td class="text-right py-1">฿{{ Number(item.price).toFixed(2) }}</td>
                <td class="text-right py-1">฿{{ (Number(item.price) * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="space-y-1 text-sm mb-4">
          <div class="flex justify-between">
            <span>ยอดรวม:</span>
            <span>฿{{ Number(sale?.subtotal).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>ส่วนลด:</span>
            <span class="text-red-600">-฿{{ Number(sale?.discount).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>ภาษี 7%:</span>
            <span>฿{{ Number(sale?.tax).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg border-t pt-2">
            <span>รวมทั้งหมด:</span>
            <span>฿{{ Number(sale?.total).toFixed(2) }}</span>
          </div>
        </div>

        <div v-if="sale?.paymentMethod" class="border-t pt-2 text-sm">
          <div class="flex justify-between mb-1">
            <span>วิธีชำระ:</span>
            <span>{{ getPaymentMethodName(sale.paymentMethod) }}</span>
          </div>
          <div v-if="sale.paymentDetails?.cashReceived" class="flex justify-between mb-1">
            <span>เงินที่ได้รับ:</span>
            <span>฿{{ sale.paymentDetails.cashReceived.toFixed(2) }}</span>
          </div>
          <div v-if="sale.paymentDetails?.change" class="flex justify-between">
            <span>เงินทอน:</span>
            <span>฿{{ sale.paymentDetails.change.toFixed(2) }}</span>
          </div>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">ขอบคุณที่ใช้บริการ</p>
          <p class="text-sm text-gray-600">สินค้าที่ซื้อแล้วไม่สามารถคืนได้</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2 mt-6">
        <button
          @click="handlePrintReceipt"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <NuxtIcon name="i-mdi-printer" class="w-4 h-4 inline mr-2" />
          พิมพ์
        </button>
        <button
          @click="handleEmailReceipt"
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <NuxtIcon name="i-mdi-email" class="w-4 h-4 inline mr-2" />
          อีเมล
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<style>
body{font-family:Arial,sans-serif;padding:20px}@media print{body{padding:10px}}
</style>
