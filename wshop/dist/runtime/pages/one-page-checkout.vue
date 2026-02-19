<script setup>
import { ref, onMounted, watch } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "~/composables/useCart";
const { cart, calculateTaxes, taxAmount, subtotal, discountAmount, giftCardAmount, total } = useCart();
const config = useRuntimeConfig();
const isProcessing = ref(false);
const errorMessage = ref("");
const stripe = ref(null);
const elements = ref(null);
const clientSecret = ref(null);
const shippingInfo = ref({
  email: "",
  name: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "TH"
  }
});
onMounted(async () => {
  try {
    stripe.value = await loadStripe(config.public.stripePublishableKey);
    if (!stripe.value) throw new Error("Stripe failed to load.");
    const intent = await $fetch("/api/stripe/payment-intent", {
      method: "POST",
      body: { cartId: cart.value?.id }
    });
    clientSecret.value = intent.clientSecret;
    if (!clientSecret.value) throw new Error("Failed to create payment intent.");
    elements.value = stripe.value.elements({ clientSecret: clientSecret.value });
    const paymentElement = elements.value.create("payment");
    paymentElement.mount("#payment-element");
  } catch (error) {
    errorMessage.value = error.data?.message || error.message || "An unexpected error occurred.";
  }
});
watch(shippingInfo.value.address, (newAddress) => {
  if (newAddress && newAddress.country && newAddress.zipCode) {
    const addressForTaxes = {
      addressLine1: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.zipCode,
      country: newAddress.country,
      isDefault: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    calculateTaxes(addressForTaxes);
  }
}, { deep: true });
const handleSubmit = async () => {
  if (!stripe.value || !elements.value) return;
  isProcessing.value = true;
  errorMessage.value = "";
  await $fetch(`/api/stripe/payment-intent/${clientSecret.value?.split("_secret_")[0]}`, {
    method: "PUT",
    body: {
      customer: { name: shippingInfo.value.name, email: shippingInfo.value.email },
      shippingAddress: shippingInfo.value.address
    }
  });
  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: `${window.location.origin}/checkout/success`,
      payment_method_data: {
        billing_details: {
          name: shippingInfo.value.name,
          email: shippingInfo.value.email,
          address: {
            line1: shippingInfo.value.address.street,
            city: shippingInfo.value.address.city,
            state: shippingInfo.value.address.state,
            postal_code: shippingInfo.value.address.zipCode,
            country: shippingInfo.value.address.country
          }
        }
      }
    }
  });
  if (error && (error.type === "card_error" || error.type === "validation_error")) {
    errorMessage.value = error.message || "An error occurred.";
  } else if (error) {
    errorMessage.value = "An unexpected error occurred.";
  }
  isProcessing.value = false;
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-8">
    <div v-if="!cart || cart.itemCount === 0" class="text-center">
      <h1 class="text-2xl font-bold mb-4">Your Cart is Empty</h1>
      <NuxtLink to="/products" class="text-blue-600 hover:underline">Continue Shopping</NuxtLink>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Left Side: Shipping & Payment -->
      <div class="space-y-8">
        <!-- Shipping Information -->
        <section>
          <h2 class="text-xl font-bold mb-4">Shipping Information</h2>
          <div class="space-y-4 bg-white p-6 rounded-lg shadow-sm">
             <!-- Form fields from CheckoutForm.vue -->
             <input v-model="shippingInfo.email" placeholder="Email" required class="w-full p-2 border rounded" />
             <input v-model="shippingInfo.name" placeholder="Full Name" required class="w-full p-2 border rounded" />
             <input v-model="shippingInfo.address.street" placeholder="Street Address" required class="w-full p-2 border rounded" />
             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input v-model="shippingInfo.address.city" placeholder="City" required class="w-full p-2 border rounded" />
                <input v-model="shippingInfo.address.state" placeholder="State / Province" required class="w-full p-2 border rounded" />
                <input v-model="shippingInfo.address.zipCode" placeholder="ZIP / Postal Code" required class="w-full p-2 border rounded" />
             </div>
             <input v-model="shippingInfo.address.country" placeholder="Country" required class="w-full p-2 border rounded" />
          </div>
        </section>

        <!-- Payment Information -->
        <section>
          <h2 class="text-xl font-bold mb-4">Payment</h2>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div v-if="clientSecret" id="payment-element"></div>
            <div v-else class="text-center p-8">Loading Payment Form...</div>
          </div>
        </section>
      </div>

      <!-- Right Side: Order Summary -->
      <div class="bg-gray-50 p-6 rounded-lg shadow-sm h-fit sticky top-8">
        <h2 class="text-xl font-bold border-b pb-4 mb-4">Your Order</h2>
        <div class="space-y-2">
          <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
            <span>{{ item.product?.name || "Product" }} x {{ item.quantity }}</span>
            <span>${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="border-t mt-4 pt-4 space-y-2">
          <div class="flex justify-between text-sm"><span>Subtotal</span><span>${{ subtotal.toFixed(2) }}</span></div>
          <div class="flex justify-between text-sm"><span>Shipping</span><span>Free</span></div>
          <div class="flex justify-between text-sm"><span>Taxes</span><span>${{ taxAmount.toFixed(2) }}</span></div>
          <div v-if="discountAmount > 0" class="flex justify-between text-sm text-green-600"><span>Discount</span><span>-${{ discountAmount.toFixed(2) }}</span></div>
          <div v-if="giftCardAmount > 0" class="flex justify-between text-sm text-green-600"><span>Gift Card</span><span>-${{ giftCardAmount.toFixed(2) }}</span></div>
          <div class="flex justify-between font-bold text-lg mt-2 border-t pt-2"><span>Total</span><span>${{ total.toFixed(2) }}</span></div>
        </div>
        <div class="mt-6">
          <button type="submit" :disabled="isProcessing || !stripe || !elements" class="w-full bg-black text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-600">
            {{ isProcessing ? "Processing..." : "Pay Now" }}
          </button>
        </div>
        <div v-if="errorMessage" class="mt-4 text-red-500 text-sm text-center">{{ errorMessage }}</div>
      </div>
    </form>
  </div>
</template>
