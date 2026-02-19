<template>
  <div class="bg-gray-50 p-4 rounded-lg">
    <div id="receipt-preview" class="bg-white p-6 max-w-md mx-auto">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold">ร้านค้า WShop</h2>
        <p class="text-sm text-gray-600">123 ถนนสุขุมวิทย์ กรุงเทพฯ</p>
        <p class="text-sm text-gray-600">โทร: 02-123-4567</p>
      </div>

      <div class="border-t border-b border-gray-300 py-2 mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span>เลขที่:</span>
          <span>{{ receiptNumber }}</span>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <span>วันที่:</span>
          <span>{{ currentDate }}</span>
        </div>
        <div class="flex justify-between text-sm mb-1">
          <span>พนักงาน:</span>
          <span>พนักงาน 1</span>
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
            <tr v-for="item in items" :key="item.id" class="border-b">
              <td class="py-1">{{ item.name }}</td>
              <td class="text-center py-1">{{ item.quantity }}</td>
              <td class="text-right py-1">฿{{ item.price.toFixed(2) }}</td>
              <td class="text-right py-1">฿{{ item.subtotal.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="space-y-1 text-sm mb-4">
        <div class="flex justify-between">
          <span>ยอดรวม:</span>
          <span>฿{{ totals.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>ส่วนลด:</span>
          <span class="text-red-600">-฿{{ totals.discount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>ภาษี 7%:</span>
          <span>฿{{ totals.tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>รวมทั้งหมด:</span>
          <span>฿{{ totals.total.toFixed(2) }}</span>
        </div>
      </div>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">ขอบคุณที่ใช้บริการ</p>
        <p class="text-sm text-gray-600">สินค้าที่ซื้อแล้วไม่สามารถคืนได้</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  totals: { type: Object, required: true },
  receiptNumber: { type: String, required: true },
  currentDate: { type: String, required: true }
});
</script>
