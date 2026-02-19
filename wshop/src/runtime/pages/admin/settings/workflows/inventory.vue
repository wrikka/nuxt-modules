<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Inventory Alerts</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Low Stock Notifications</h2>
      <div>
        <label>
          <input type="checkbox" checked />
          Enable low stock notifications
        </label>
      </div>
      <div>
        <label>Notification Threshold</label>
        <input type="number" value="10" />
        <p>Notify when stock level for a product is 10 or less.</p>
      </div>
      <div>
        <label>Recipient Email(s)</label>
        <input type="text" placeholder="inventory@example.com, manager@example.com" />
        <p>Separate multiple emails with a comma.</p>
      </div>
    </section>

    <section>
      <h2>Out of Stock Visibility</h2>
      <div>
        <label>
          <input type="checkbox" />
          Hide out of stock products from the storefront
        </label>
      </div>
    </section>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'admin',
  });
</script>
