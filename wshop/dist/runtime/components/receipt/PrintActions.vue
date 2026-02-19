<template>
  <div class="space-y-4">
    <!-- Action Buttons -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        @click="$emit('printBrowser')"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <NuxtIcon name="i-mdi-printer" class="w-4 h-4 mr-2" />
        พิมพ์เบราว์เซอร์
      </button>
      
      <button
        @click="$emit('generatePDF')"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <NuxtIcon name="i-mdi-file-document" class="w-4 h-4 mr-2" />
        สร้าง PDF
      </button>
      
      <button
        @click="$emit('generateImage')"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        <NuxtIcon name="i-mdi-image" class="w-4 h-4 mr-2" />
        สร้างรูปภาพ
      </button>
      
      <button
        @click="$emit('generateTaxInvoice')"
        :disabled="loading"
        class="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
      >
        <NuxtIcon name="i-mdi-file-document" class="w-4 h-4 mr-2" />
        ใบกำกับภาษี
      </button>
    </div>

    <!-- Email Options -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-700 mb-3">ส่งทางอีเมล</h4>
      <div class="flex space-x-2">
        <input
          :model-value="emailAddress"
          @input="$emit('update:emailAddress', $event.target.value)"
          type="email"
          placeholder="กรอกอีเมลลูกค้า"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          @click="$emit('sendEmail')"
          :disabled="loading || !emailAddress"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <NuxtIcon name="i-mdi-email" class="w-4 h-4 mr-2" />
          ส่ง
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: { type: Boolean, required: true },
  emailAddress: { type: String, required: true }
});
defineEmits(["printBrowser", "generatePDF", "generateImage", "generateTaxInvoice", "sendEmail", "update:emailAddress"]);
</script>
