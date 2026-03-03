<script setup lang="ts">
import { usePointOfSale } from '~/composables/pos/usePointOfSale'
import { useConfirmationDialog } from '~/composables/core/useConfirmationDialog'
import type { Product, Customer, POSSession, CashPayment, QRCodePayment, CardPayment } from '#shared/types'

const confirmationDialog = useConfirmationDialog()
const {
  cartItems,
  registers,
  categories,
  products,
  selectedRegister,
  selectedCustomer,
  selectedPaymentMethod,
  paymentMethods,
  currentUser,
  subtotal,
  discount,
  tax,
  total,
  loading,
  processing,
  loadRegisters,
  loadCategories,
  loadProducts,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  selectCustomer,
  completeSale: completeSaleApi,
  suspendSale,
  endShift: endShiftApi,
  addNotification
} = usePointOfSale()

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)
const showCustomerModal = ref(false)
const showPaymentModal = ref(false)
const showReceiptModal = ref(false)
const currentSale = ref<POSSession | null>(null)

const filteredProducts = computed(() => {
  let filtered = products.value

  if (selectedCategory.value) {
    filtered = filtered.filter((p: Product) => p.categoryId === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((product: Product) =>
      product.name.toLowerCase().includes(query) ||
      product.id.toString().includes(query)
    )
  }

  return filtered
})

const handleSelectCustomer = (customer: Customer) => {
  selectCustomer(customer)
  showCustomerModal.value = false
}

const openRegisterSettings = () => {
  // Placeholder for register settings logic
}

const processPayment = () => {
  if (cartItems.value && Array.isArray(cartItems.value) && cartItems.value.length > 0 && selectedPaymentMethod.value) {
    showPaymentModal.value = true
  }
}

const completeSale = async (paymentDetails: CashPayment | QRCodePayment | CardPayment) => {
  try {
    const sale = await completeSaleApi(paymentDetails)
    currentSale.value = sale
    showPaymentModal.value = false
    showReceiptModal.value = true
  } catch (error) {
    console.error('Failed to complete sale:', error)
  }
}

const printReceipt = () => {
  if (currentSale.value) {
    // In a real app, you'd use a proper printing library
    window.print()
  }
}

const endShift = () => {
  if (confirmationDialog.isRevealed.value) {
    confirmationDialog.reveal({
      title: 'จบกะการทำงาน',
      message: 'คุณแน่ใจหรือไม่ว่าต้องการจบกะการทำงานปัจจุบัน?',
      confirmText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      isDestructive: false,
      onConfirm: async () => {
        try {
          await endShiftApi();
          addNotification({ type: 'success', message: 'จบกะการทำงานเรียบร้อยแล้ว' });
          // Optionally, navigate away or show a summary
        } catch (error) {
          console.error('Failed to end shift:', error);
          addNotification({ type: 'error', message: 'เกิดข้อผิดพลาดในการจบกะ' });
        }
      },
    });
  }
};

onMounted(async () => {
  await Promise.all([loadRegisters(), loadCategories(), loadProducts()])
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PosHeader || undefined
      :registers="registers"
      v-model:selectedRegister="selectedRegister"
      :current-user="currentUser"
      @open-settings="openRegisterSettings"
      @end-shift="endShift"
    />

    <div class="flex h-screen pt-16">
      <ProductSelectionPanel
        :products="filteredProducts"
        :categories="categories"
        @add-to-cart="addToCart"
        @update:searchQuery="searchQuery = $event"
        @update:selectedCategory="selectedCategory = $event"
      />

      <CartPanel
        :cart-items="cartItems"
        :selected-customer="selectedCustomer"
        :subtotal="subtotal"
        :discount="discount"
        :tax="tax"
        :total="total"
        :payment-methods="paymentMethods"
        v-model:selectedPaymentMethod="selectedPaymentMethod"
        @clear-cart="clearCart"
        @update-quantity="updateQuantity"
        @remove-from-cart="removeFromCart"
        @open-customer-modal="showCustomerModal = true"
        @process-payment="processPayment"
        @suspend-sale="suspendSale"
      />
    </div>

    <CustomerSelectModal
      v-if="showCustomerModal"
      @close="showCustomerModal = false"
      @select="handleSelectCustomer"
    />
    
    <PaymentModal
      :show="showPaymentModal"
      :amount="total"
      @close="showPaymentModal = false"
      @success="completeSale"
    />
    
    <ReceiptModal
      v-if="showReceiptModal && currentSale"
      :sale="currentSale"
      @close="showReceiptModal = false"
      @print="printReceipt"
    />
  </div>
</template>
