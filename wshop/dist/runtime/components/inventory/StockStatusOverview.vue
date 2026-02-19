<script setup>
defineProps({
  totalProducts: { type: Number, required: true },
  inStockCount: { type: Number, required: true },
  lowStockCount: { type: Number, required: true },
  outOfStockCount: { type: Number, required: true }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="bg-blue-50 p-4 rounded-lg">
      <div class="flex items-center">
        <Icon name="mdi:package-variant" class="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <p class="text-sm text-blue-600">สินค้าทั้งหมด</p>
          <p class="text-2xl font-bold text-blue-800">{{ totalProducts }}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-green-50 p-4 rounded-lg">
      <div class="flex items-center">
        <Icon name="mdi:check-circle" class="w-8 h-8 text-green-600 mr-3" />
        <div>
          <p class="text-sm text-green-600">มีสินค้า</p>
          <p class="text-2xl font-bold text-green-800">{{ inStockCount }}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-yellow-50 p-4 rounded-lg">
      <div class="flex items-center">
        <Icon name="mdi:alert" class="w-8 h-8 text-yellow-600 mr-3" />
        <div>
          <p class="text-sm text-yellow-600">สต็อกต่ำ</p>
          <p class="text-2xl font-bold text-yellow-800">{{ lowStockCount }}</p>
        </div>
      </div>
    </div>
    
    <div class="bg-red-50 p-4 rounded-lg">
      <div class="flex items-center">
        <Icon name="mdi:close-circle" class="w-8 h-8 text-red-600 mr-3" />
        <div>
          <p class="text-sm text-red-600">หมดสต็อก</p>
          <p class="text-2xl font-bold text-red-800">{{ outOfStockCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
