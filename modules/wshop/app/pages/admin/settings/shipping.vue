<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Shipping & Delivery</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Shipping Zones</h2>
      <button>Add Shipping Zone</button>
      <!-- List of zones -->
      <div v-if="loading">
        <p>Loading shipping zones...</p>
      </div>
      <AdminSettingsShippingZoneList v-else :zones="shippingZones" />
    </section>


    <section>
      <h2>Local Pickup</h2>
      <label>
        <input type="checkbox" />
        Allow customers to pick up their orders
      </label>
      <div>
        <label>Pickup Location Address</label>
        <input type="text" placeholder="Enter pickup address" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { shippingZones, loading, fetchShippingZones } = useShipping();

onMounted(() => {
  fetchShippingZones();
});

definePageMeta({
  layout: 'admin',
});
</script>
