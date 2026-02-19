<script setup>
import { usePointOfSale } from "~/composables/pos/usePointOfSale";
import { useConfirmationDialog } from "~/composables/core/useConfirmationDialog";
const confirmationDialog = useConfirmationDialog();
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
} = usePointOfSale();
const searchQuery = ref("");
const selectedCategory = ref(null);
const showCustomerModal = ref(false);
const showPaymentModal = ref(false);
const showReceiptModal = ref(false);
const currentSale = ref(null);
const filteredProducts = computed(() => {
  let filtered = products.value;
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.categoryId === selectedCategory.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (product) => product.name.toLowerCase().includes(query) || product.id.toString().includes(query)
    );
  }
  return filtered;
});
const handleSelectCustomer = (customer) => {
  selectCustomer(customer);
  showCustomerModal.value = false;
};
const openRegisterSettings = () => {
};
const processPayment = () => {
  if (cartItems.value && Array.isArray(cartItems.value) && cartItems.value.length > 0 && selectedPaymentMethod.value) {
    showPaymentModal.value = true;
  }
};
const completeSale = async (paymentDetails) => {
  try {
    const sale = await completeSaleApi(paymentDetails);
    currentSale.value = sale;
    showPaymentModal.value = false;
    showReceiptModal.value = true;
  } catch (error) {
    console.error("Failed to complete sale:", error);
  }
};
const printReceipt = () => {
  if (currentSale.value) {
    window.print();
  }
};
const endShift = () => {
  if (confirmationDialog.isRevealed.value) {
    confirmationDialog.reveal({
      title: "\u0E08\u0E1A\u0E01\u0E30\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19",
      message: "\u0E04\u0E38\u0E13\u0E41\u0E19\u0E48\u0E43\u0E08\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E08\u0E1A\u0E01\u0E30\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19?",
      confirmText: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19",
      cancelText: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01",
      isDestructive: false,
      onConfirm: async () => {
        try {
          await endShiftApi();
          addNotification({ type: "success", message: "\u0E08\u0E1A\u0E01\u0E30\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27" });
        } catch (error) {
          console.error("Failed to end shift:", error);
          addNotification({ type: "error", message: "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E08\u0E1A\u0E01\u0E30" });
        }
      }
    });
  }
};
onMounted(async () => {
  await Promise.all([loadRegisters(), loadCategories(), loadProducts()]);
});
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
