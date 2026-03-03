<script setup lang="ts">
import { computed } from 'vue';
import OrderItems from '~/components/admin/orders/OrderItems.vue';
import OrderPaymentSummary from '~/components/admin/orders/OrderPaymentSummary.vue';
import OrderStatus from '~/components/admin/orders/OrderStatus.vue';
import OrderCustomerDetails from '~/components/admin/orders/OrderCustomerDetails.vue';
import FraudRisk from '~/components/admin/orders/FraudRisk.vue';
import AdminPageHeader from '~/components/admin/ui/AdminPageHeader.vue';
import AdminPageLayout from '~/components/admin/ui/AdminPageLayout.vue';
import AdminCard from '~/components/admin/ui/AdminCard.vue';
import type { Order } from '#shared/types';
import type Stripe from 'stripe';

const route = useRoute();
const orderId = route.params.id as string;

// Fetch order details
const { data, pending, error } = useAsyncData(
  `order-details-${orderId}`,
  async () => {
    const orderData = await $fetch<{ data: Order }>(`/api/orders/${orderId}`);
    const order = orderData.data;

    let paymentIntent: Stripe.PaymentIntent | null = null;
    if (order.paymentIntentId) {
      try {
        paymentIntent = await $fetch<Stripe.PaymentIntent>(`/api/stripe/payment-intent/${order.paymentIntentId}`);
      } catch (e) {
        console.error('Failed to fetch payment intent:', e);
      }
    }

    return { order, paymentIntent };
  }
);

const order = computed(() => data.value?.order ?? null);
const paymentIntent = computed(() => data.value?.paymentIntent ?? null);

const updateStatus = async (newStatus: { orderStatus: string; paymentStatus: string }) => {
  if (!order.value) return;
  try {
    await $fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: {
        status: newStatus.orderStatus,
        paymentStatus: newStatus.paymentStatus,
      },
    });
    // Optionally, refresh the order data or show a success message
  } catch (err) {
    console.error('Failed to update order status:', err);
    // TODO: Show error notification to user
  }
};
</script>

<template>
  <div class="p-8">
    <AdminPageHeader :title="`Order #${order && order.id ? order.id.substring(0, 8) : ''}`">
      <template #actions>
        <NuxtLink to="/admin/orders" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Back to Orders</NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="pending">Loading order details...</div>
    <div v-else-if="error" class="text-red-500">Error loading order: {{ error.message }}</div>

    <AdminPageLayout v-else-if="order">
      <template #main>
        <AdminCard title="Order Items">
          <OrderItems :items="order.items" />
        </AdminCard>
        <AdminCard title="Payment Summary">
          <OrderPaymentSummary :subtotal="order.subtotal" :shipping-cost="order.shippingCost" :tax-amount="order.taxAmount" :total="order.total" />
        </AdminCard>
      </template>

      <template #sidebar>
        <AdminCard title="Order Status">
          <OrderStatus :order-status="order.status" :payment-status="order.paymentStatus" @update-status="updateStatus" />
        </AdminCard>
        <AdminCard title="Fraud Risk" v-if="paymentIntent && (paymentIntent as any).outcome">
          <FraudRisk :outcome="(paymentIntent as any).outcome" />
        </AdminCard>
        <AdminCard title="Customer">
          <OrderCustomerDetails :customer="order.customer" :shipping-address="order.shippingAddress" />
        </AdminCard>
      </template>
    </AdminPageLayout>
  </div>
</template>
