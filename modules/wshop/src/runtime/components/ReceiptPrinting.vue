<script setup lang="ts">
import { useReceiptPrinting } from '~/composables/useReceiptPrinting'
import ReceiptPreview from './receipt/ReceiptPreview.vue'
import PrintOptions from './receipt/PrintOptions.vue'
import PrintActions from './receipt/PrintActions.vue'
import LoadingOverlay from './receipt/LoadingOverlay.vue'

const emit = defineEmits<{
  close: []
}>()

const {
  printing: loading,
  printReceipt,
  generateTaxInvoice
} = useReceiptPrinting()

const printOptions = ref({
  includeLogo: true,
  includeBarcode: true,
  includeQRCode: true,
  includeTerms: true
})

const printerSettings = ref({
  paperSize: '80mm',
  fontSize: 'medium',
  copies: 1
})

const emailAddress = ref('')

const receiptNumber = computed(() => `RCP-${Date.now()}`)
const currentDate = computed(() => new Date().toLocaleString('th-TH'))

const sampleItems = ref([
  {
    id: 1,
    name: 'สินค้าตัวอย่าง 1',
    quantity: 2,
    price: 150.00,
    subtotal: 300.00
  },
  {
    id: 2,
    name: 'สินค้าตัวอย่าง 2',
    quantity: 1,
    price: 250.00,
    subtotal: 250.00
  }
])

const sampleTotals = computed(() => ({
  subtotal: 550.00,
  discount: 50.00,
  tax: 35.00,
  total: 535.00
}))

const printBrowser = async () => {
  try {
    const mockSession = {
      id: '1',
      sessionId: receiptNumber.value,
      status: 'completed' as const,
      items: sampleItems.value.map(item => ({
        productId: item.id.toString(),
        variantId: item.id.toString(),
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: sampleTotals.value.subtotal,
      tax: sampleTotals.value.tax,
      discount: sampleTotals.value.discount,
      total: sampleTotals.value.total,
      paymentMethod: 'cash',
      paymentDetails: {
        amount: sampleTotals.value.total
      },
      customerId: null,
      staffId: '1',
      registerId: '1',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
    await printReceipt(mockSession)
  } catch (_error) {
    console.error('Failed to print receipt:', _error)
  }
}

const generatePDF = async () => {
  try {
    alert('สร้าง PDF ยังไม่รองรับ')
  } catch (_error) {
    console.error('Failed to generate PDF:', _error)
  }
}

const generateImage = async () => {
  try {
    alert('สร้างรูปภาพ ยังไม่รองรับ')
  } catch (_error) {
    console.error('Failed to generate image:', _error)
  }
}

const generateTaxInvoiceFunc = async () => {
  try {
    const mockSession = {
      id: 1,
      sessionId: receiptNumber.value,
      status: 'completed' as const,
      items: sampleItems.value.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        subtotal: item.subtotal
      })),
      subtotal: sampleTotals.value.subtotal,
      tax: sampleTotals.value.tax,
      discount: sampleTotals.value.discount,
      total: sampleTotals.value.total,
      paymentMethod: 'cash' as const,
      paymentDetails: {
        amount: sampleTotals.value.total
      },
      customerId: 1,
      staffId: 1,
      registerId: 1,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }

    await generateTaxInvoice(mockSession)
  } catch (_error) {
    console.error('Failed to generate tax invoice:', _error)
  }
}

const sendEmail = async () => {
  if (!emailAddress.value) return

  try {
    alert('ส่งอีเมล ยังไม่รองรับ')
  } catch (_error) {
    console.error('Failed to send email:', _error)
    alert('ไม่สามารถส่งอีเมลได้')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">การพิมพ์ใบเสร็จ</h2>
      <button
        @click="$emit('close')"
        class="p-2 hover:bg-gray-100 rounded-lg"
      >
        <NuxtIcon name="i-mdi-close" class="w-5 h-5" />
      </button>
    </div>

    <!-- Receipt Preview -->
    <ReceiptPreview
      :items="sampleItems"
      :totals="sampleTotals"
      :receipt-number="receiptNumber"
      :current-date="currentDate"
      class="mb-6"
    />

    <!-- Printing Options -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">ตัวเลือกการพิมพ์</h3>
      
      <PrintOptions
        v-model:include-logo="printOptions.includeLogo"
        v-model:include-barcode="printOptions.includeBarcode"
        v-model:include-qr-code="printOptions.includeQRCode"
        v-model:include-terms="printOptions.includeTerms"
        v-model:paper-size="printerSettings.paperSize"
        v-model:font-size="printerSettings.fontSize"
        v-model:copies="printerSettings.copies"
        :print-options="printOptions"
        :printer-settings="printerSettings"
      />

      <PrintActions
        :loading="loading"
        :email-address="emailAddress"
        v-model:email-address="emailAddress"
        @print-browser="printBrowser"
        @generate-pdf="generatePDF"
        @generate-image="generateImage"
        @generate-tax-invoice="generateTaxInvoiceFunc"
        @send-email="sendEmail"
      />
    </div>

    <!-- Loading Overlay -->
    <LoadingOverlay :show="loading" />
  </div>
</template>
