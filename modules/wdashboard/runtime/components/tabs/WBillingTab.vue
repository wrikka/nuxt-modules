<script setup lang="ts">
const currentPlan = ref({
  name: 'Pro Plan',
  price: 29,
  billingCycle: 'monthly',
  nextBilling: '2024-02-15',
  status: 'active'
})

const paymentMethods = ref([
  { id: 1, type: 'card', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2025, isDefault: true },
  { id: 2, type: 'card', brand: 'Mastercard', last4: '8888', expMonth: 8, expYear: 2024, isDefault: false }
])

const invoices = ref([
  { id: 'INV-001', date: '2024-01-15', amount: 29, status: 'paid', pdf: '#' },
  { id: 'INV-002', date: '2023-12-15', amount: 29, status: 'paid', pdf: '#' },
  { id: 'INV-003', date: '2023-11-15', amount: 29, status: 'paid', pdf: '#' }
])

const handleChangePlan = () => {
  console.log('Change plan')
}

const handleAddPayment = () => {
  console.log('Add payment method')
}

const handleSetDefault = (id: number) => {
  paymentMethods.value.forEach(method => {
    method.isDefault = method.id === id
  })
}

const handleRemovePayment = (id: number) => {
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Current Plan</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <h3 class="text-lg font-semibold">{{ currentPlan.name }}</h3>
            <p class="text-gray-500">${{ currentPlan.price }}/{{ currentPlan.billingCycle }}</p>
          </div>
          <span class="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">{{ currentPlan.status }}</span>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Next billing date</p>
            <p class="text-sm text-gray-500">{{ currentPlan.nextBilling }}</p>
          </div>
          <button class="px-4 py-2 border rounded hover:bg-gray-50" @click="handleChangePlan">Change Plan</button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Payment Methods</h2>
        <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" @click="handleAddPayment">Add Method</button>
      </div>
      <div class="space-y-4">
        <div v-for="method in paymentMethods" :key="method.id" class="flex items-center justify-between rounded-lg border p-4">
          <div class="flex items-center gap-4">
            <div class="text-2xl">💳</div>
            <div>
              <p class="font-medium">{{ method.brand }} ending in {{ method.last4 }}</p>
              <p class="text-sm text-gray-500">Expires {{ method.expMonth }}/{{ method.expYear }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="method.isDefault" class="px-2 py-1 text-xs bg-gray-100 rounded">Default</span>
            <button v-else class="px-3 py-1 text-sm hover:bg-gray-50" @click="handleSetDefault(method.id)">Set Default</button>
            <button class="px-3 py-1 text-sm hover:bg-gray-50" @click="handleRemovePayment(method.id)">Remove</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Billing History</h2>
      <div class="space-y-2">
        <div v-for="invoice in invoices" :key="invoice.id" class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="font-medium">{{ invoice.id }}</p>
            <p class="text-sm text-gray-500">{{ invoice.date }}</p>
          </div>
          <div class="flex items-center gap-4">
            <p class="font-medium">${{ invoice.amount }}</p>
            <span class="px-2 py-1 text-xs rounded-full" :class="invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">{{ invoice.status }}</span>
            <a class="text-sm text-blue-600 hover:underline" :href="invoice.pdf">Download</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
