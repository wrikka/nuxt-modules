<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Payment Gateways</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Connected Providers</h2>
            <div v-if="loading">
        <p>Loading providers...</p>
      </div>
      <AdminSettingsPaymentProviderList v-else :providers="providers" />
    </section>

    <section>
      <h2>Add a Provider</h2>
      <select>
        <option disabled selected>Choose a provider</option>
        <option>Stripe</option>
        <option>PayPal</option>
        <option>Omise</option>
      </select>
      <button>Add</button>
    </section>

    <section>
      <h2>Manual Payment Methods</h2>
      <div>
        <label>
          <input type="checkbox" />
          Cash on Delivery (COD)
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" />
          Bank Transfer
        </label>
        <textarea placeholder="Enter bank account details here..."></textarea>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { providers, loading, fetchProviders } = usePayments();

onMounted(() => {
  fetchProviders();
});

definePageMeta({
  layout: 'admin',
});
</script>
