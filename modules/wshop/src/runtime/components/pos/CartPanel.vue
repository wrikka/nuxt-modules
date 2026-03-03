<script setup lang="ts">
import type { CartItem, Customer, PaymentMethod } from '~~/shared/types'
import CartItemComponent from './CartItem.vue'
import CartSummary from './CartSummary.vue'
import PaymentActions from './PaymentActions.vue'

defineProps<{
  cartItems: CartItem[]
  selectedCustomer: Customer | null
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethods: PaymentMethod[]
  selectedPaymentMethod: string | null
}>()

const emit = defineEmits<{
  (e: 'clear-cart'): void
  (e: 'update-quantity', itemId: string, quantity: number): void
  (e: 'remove-from-cart', itemId: string): void
  (e: 'open-customer-modal'): void
  (e: 'update:selectedPaymentMethod', methodId: string): void
  (e: 'process-payment'): void
  (e: 'suspend-sale'): void
}>()
</script>

<template>
  <div class="w-1/3 flex flex-col">
    <!-- Cart -->
    <div class="flex-1 bg-white p-4 overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">ตะกร้าสินค้า</h2>
        <button
          v-if="cartItems.length > 0"
          @click="emit('clear-cart')"
          class="text-sm text-red-600 hover:text-red-800"
        >
          ล้างตะกร้า
        </button>
      </div>

      <div v-if="cartItems.length === 0" class="text-center py-8 text-gray-500">
        <Icon name="mdi:cart" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      </div>

      <div v-else class="space-y-3">
        <CartItemComponent
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @update-quantity="(itemId: string, quantity: number) => emit('update-quantity', itemId, quantity)"
          @remove-from-cart="(itemId: string) => emit('remove-from-cart', itemId)"
        />
      </div>
    </div>

    <!-- Payment Section -->
    <div class="bg-gray-50 border-t p-4">
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-gray-700">ลูกค้า</label>
          <button
            @click="emit('open-customer-modal')"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            เลือกลูกค้า
          </button>
        </div>
        <div v-if="selectedCustomer" class="text-sm text-gray-600">
          {{ selectedCustomer.name || 'Customer' }}
        </div>
        <div v-else class="text-sm text-gray-500">ลูกค้าทั่วไป</div>
      </div>

      <CartSummary
        :subtotal="subtotal"
        :discount="discount"
        :tax="tax"
        :total="total"
      />

      <PaymentActions
        :payment-methods="paymentMethods"
        :selected-payment-method="selectedPaymentMethod"
        :cart-items="cartItems"
        @update:selected-payment-method="emit('update:selectedPaymentMethod', $event)"
        @process-payment="emit('process-payment')"
        @suspend-sale="emit('suspend-sale')"
      />
    </div>
  </div>
</template>
