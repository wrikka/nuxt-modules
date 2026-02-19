<script setup>
defineProps({
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true }
});
</script>

<template>
  <div class="space-y-2 mb-4">
    <div class="flex justify-between text-sm">
      <span>ยอดรวม:</span>
      <span>฿{{ subtotal.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span>ส่วนลด:</span>
      <span class="text-red-600">-฿{{ discount.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span>ภาษี 7%:</span>
      <span>฿{{ tax.toFixed(2) }}</span>
    </div>
    <div class="flex justify-between font-bold text-lg border-t pt-2">
      <span>รวมทั้งหมด:</span>
      <span>฿{{ total.toFixed(2) }}</span>
    </div>
  </div>
</template>
