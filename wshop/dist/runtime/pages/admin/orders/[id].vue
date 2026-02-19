<script setup>
import { computed } from "vue";
import OrderItems from "~/components/admin/orders/OrderItems.vue";
import OrderPaymentSummary from "~/components/admin/orders/OrderPaymentSummary.vue";
import OrderStatus from "~/components/admin/orders/OrderStatus.vue";
import OrderCustomerDetails from "~/components/admin/orders/OrderCustomerDetails.vue";
import FraudRisk from "~/components/admin/orders/FraudRisk.vue";
import AdminPageHeader from "~/components/admin/ui/AdminPageHeader.vue";
import AdminPageLayout from "~/components/admin/ui/AdminPageLayout.vue";
import AdminCard from "~/components/admin/ui/AdminCard.vue";
const route = useRoute();
const orderId = route.params.id;
const { data, pending, error } = useAsyncData(
  `order-details-${orderId}`,
  async () => {
    const orderData = await $fetch(`/api/orders/${orderId}`);
    const order2 = orderData.data;
    let paymentIntent2 = null;
    if (order2.paymentIntentId) {
      try {
        paymentIntent2 = await $fetch(`/api/stripe/payment-intent/${order2.paymentIntentId}`);
      } catch (e) {
        console.error("Failed to fetch payment intent:", e);
      }
    }
    return { order: order2, paymentIntent: paymentIntent2 };
  }
);
const order = computed(() => data.value?.order ?? null);
const paymentIntent = computed(() => data.value?.paymentIntent ?? null);
const updateStatus = async (newStatus) => {
  if (!order.value) return;
  try {
    await $fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      body: {
        status: newStatus.orderStatus,
        paymentStatus: newStatus.paymentStatus
      }
    });
  } catch (err) {
    console.error("Failed to update order status:", err);
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
        <AdminCard title="Fraud Risk" v-if="paymentIntent && paymentIntent.outcome">
          <FraudRisk :outcome="paymentIntent.outcome" />
        </AdminCard>
        <AdminCard title="Customer">
          <OrderCustomerDetails :customer="order.customer" :shipping-address="order.shippingAddress" />
        </AdminCard>
      </template>
    </AdminPageLayout>
  </div>
</template>
