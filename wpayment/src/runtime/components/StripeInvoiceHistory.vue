<script setup lang="ts">
import type { Invoice } from '#wpayment/types';

interface Props {
  invoices: Invoice[];
  loading?: boolean;
  showActions?: boolean;
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  pageSize: 10,
});

const emit = defineEmits<{
  view: [invoice: Invoice];
  pay: [invoice: Invoice];
  download: [invoice: Invoice];
}>();

const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.invoices.length / props.pageSize));

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.invoices.slice(start, start + props.pageSize);
});

const formatAmount = (invoice: Invoice) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: invoice.currency,
  }).format(invoice.amount_due / 100);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'text-green-600 bg-green-100',
    open: 'text-blue-600 bg-blue-100',
    void: 'text-gray-600 bg-gray-100',
    uncollectible: 'text-red-600 bg-red-100',
    draft: 'text-yellow-600 bg-yellow-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};
</script>

<template>
  <div class="stripe-invoice-history">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="invoices.length === 0" class="text-center py-8 text-gray-500">
      No invoices found
    </div>

    <div v-else>
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-3 px-4">Invoice</th>
            <th class="text-left py-3 px-4">Amount</th>
            <th class="text-left py-3 px-4">Date</th>
            <th class="text-left py-3 px-4">Status</th>
            <th v-if="showActions" class="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in paginatedInvoices" :key="invoice.id" class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">
              <span class="font-medium">{{ invoice.number || invoice.id }}</span>
            </td>
            <td class="py-3 px-4">{{ formatAmount(invoice) }}</td>
            <td class="py-3 px-4">{{ formatDate(invoice.created) }}</td>
            <td class="py-3 px-4">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(invoice.status)]">
                {{ invoice.status }}
              </span>
            </td>
            <td v-if="showActions" class="py-3 px-4 text-right">
              <button
                class="text-primary hover:underline mr-2"
                @click="emit('view', invoice)"
              >
                View
              </button>
              <button
                v-if="invoice.status === 'open'"
                class="text-primary hover:underline mr-2"
                @click="emit('pay', invoice)"
              >
                Pay
              </button>
              <button
                v-if="invoice.invoice_pdf"
                class="text-primary hover:underline"
                @click="emit('download', invoice)"
              >
                PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="totalPages > 1" class="flex justify-center mt-4 gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200',
          ]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>
