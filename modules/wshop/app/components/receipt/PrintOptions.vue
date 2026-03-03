<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Print Options -->
    <div class="space-y-3">
      <h4 class="font-medium text-gray-700">ตัวเลือกพิมพ์</h4>
      
      <label class="flex items-center">
        <input
          :model-value="printOptions.includeLogo"
          @input="$emit('update:includeLogo', ($event.target as HTMLInputElement).checked)"
          type="checkbox"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
        />
        <span class="text-sm">รวมโลโก้</span>
      </label>
      
      <label class="flex items-center">
        <input
          :model-value="printOptions.includeBarcode"
          @input="$emit('update:includeBarcode', ($event.target as HTMLInputElement).checked)"
          type="checkbox"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
        />
        <span class="text-sm">รวมบาร์โค้ด</span>
      </label>
      
      <label class="flex items-center">
        <input
          :model-value="printOptions.includeQRCode"
          @input="$emit('update:includeQRCode', ($event.target as HTMLInputElement).checked)"
          type="checkbox"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
        />
        <span class="text-sm">รวม QR Code</span>
      </label>
      
      <label class="flex items-center">
        <input
          :model-value="printOptions.includeTerms"
          @input="$emit('update:includeTerms', ($event.target as HTMLInputElement).checked)"
          type="checkbox"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
        />
        <span class="text-sm">รวมเงื่อนไว้</span>
      </label>
    </div>

    <!-- Printer Settings -->
    <div class="space-y-3">
      <h4 class="font-medium text-gray-700">ตั้งค่าเครื่องพิมพ์</h4>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ขนาดกระดาษ</label>
        <select
          :model-value="printerSettings.paperSize"
          @input="$emit('update:paperSize', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="80mm">80mm (เครื่องร้อนความ)</option>
          <option value="58mm">58mm (เครื่องพกพก)</option>
          <option value="a4">A4 (ปกตามาธรรม)</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ความความ</label>
        <select
          :model-value="printerSettings.fontSize"
          @input="$emit('update:fontSize', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="small">เล็ก</option>
          <option value="medium">กลาง</option>
          <option value="large">ใหญ่</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนสำเนา</label>
        <input
          :model-value="printerSettings.copies"
          @input="$emit('update:copies', parseInt(($event.target as HTMLInputElement).value))"
          type="number"
          min="1"
          max="10"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PrintOptions {
  includeLogo: boolean
  includeBarcode: boolean
  includeQRCode: boolean
  includeTerms: boolean
}

interface PrinterSettings {
  paperSize: string
  fontSize: string
  copies: number
}

interface Props {
  printOptions: PrintOptions
  printerSettings: PrinterSettings
}

interface Emits {
  (e: 'update:includeLogo', value: boolean): void
  (e: 'update:includeBarcode', value: boolean): void
  (e: 'update:includeQRCode', value: boolean): void
  (e: 'update:includeTerms', value: boolean): void
  (e: 'update:paperSize', value: string): void
  (e: 'update:fontSize', value: string): void
  (e: 'update:copies', value: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
