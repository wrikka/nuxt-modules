<script setup>
import { useReceiptPrinting } from "~/composables/useReceiptPrinting";
import ReceiptPreview from "./receipt/ReceiptPreview.vue";
import PrintOptions from "./receipt/PrintOptions.vue";
import PrintActions from "./receipt/PrintActions.vue";
import LoadingOverlay from "./receipt/LoadingOverlay.vue";
const emit = defineEmits(["close"]);
const {
  printing: loading,
  printReceipt,
  generateTaxInvoice
} = useReceiptPrinting();
const printOptions = ref({
  includeLogo: true,
  includeBarcode: true,
  includeQRCode: true,
  includeTerms: true
});
const printerSettings = ref({
  paperSize: "80mm",
  fontSize: "medium",
  copies: 1
});
const emailAddress = ref("");
const receiptNumber = computed(() => `RCP-${Date.now()}`);
const currentDate = computed(() => (/* @__PURE__ */ new Date()).toLocaleString("th-TH"));
const sampleItems = ref([
  {
    id: 1,
    name: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 1",
    quantity: 2,
    price: 150,
    subtotal: 300
  },
  {
    id: 2,
    name: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07 2",
    quantity: 1,
    price: 250,
    subtotal: 250
  }
]);
const sampleTotals = computed(() => ({
  subtotal: 550,
  discount: 50,
  tax: 35,
  total: 535
}));
const printBrowser = async () => {
  try {
    const mockSession = {
      id: "1",
      sessionId: receiptNumber.value,
      status: "completed",
      items: sampleItems.value.map((item) => ({
        productId: item.id.toString(),
        variantId: item.id.toString(),
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: sampleTotals.value.subtotal,
      tax: sampleTotals.value.tax,
      discount: sampleTotals.value.discount,
      total: sampleTotals.value.total,
      paymentMethod: "cash",
      paymentDetails: {
        amount: sampleTotals.value.total
      },
      customerId: null,
      staffId: "1",
      registerId: "1",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      completedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await printReceipt(mockSession);
  } catch (_error) {
    console.error("Failed to print receipt:", _error);
  }
};
const generatePDF = async () => {
  try {
    alert("\u0E2A\u0E23\u0E49\u0E32\u0E07 PDF \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A");
  } catch (_error) {
    console.error("Failed to generate PDF:", _error);
  }
};
const generateImage = async () => {
  try {
    alert("\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A");
  } catch (_error) {
    console.error("Failed to generate image:", _error);
  }
};
const generateTaxInvoiceFunc = async () => {
  try {
    const mockSession = {
      id: 1,
      sessionId: receiptNumber.value,
      status: "completed",
      items: sampleItems.value.map((item) => ({
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
      paymentMethod: "cash",
      paymentDetails: {
        amount: sampleTotals.value.total
      },
      customerId: 1,
      staffId: 1,
      registerId: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      completedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await generateTaxInvoice(mockSession);
  } catch (_error) {
    console.error("Failed to generate tax invoice:", _error);
  }
};
const sendEmail = async () => {
  if (!emailAddress.value) return;
  try {
    alert("\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25 \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A");
  } catch (_error) {
    console.error("Failed to send email:", _error);
    alert("\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E14\u0E49");
  }
};
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
