<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Email Notifications</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Customer Notifications</h2>
      <div class="notification-item">
        <label>
          <input type="checkbox" checked />
          Order Confirmation
        </label>
        <button>Edit Template</button>
      </div>
      <div class="notification-item">
        <label>
          <input type="checkbox" checked />
          Shipping Confirmation
        </label>
        <button>Edit Template</button>
      </div>
      <div class="notification-item">
        <label>
          <input type="checkbox" />
          Shipping Update
        </label>
        <button>Edit Template</button>
      </div>
      <div class="notification-item">
        <label>
          <input type="checkbox" checked />
          Order Delivered
        </label>
        <button>Edit Template</button>
      </div>
      <div class="notification-item">
        <label>
          <input type="checkbox" />
          Abandoned Cart
        </label>
        <button>Edit Template</button>
      </div>
    </section>

    <section>
      <h2>Admin Notifications</h2>
      <div class="notification-item">
        <label>
          <input type="checkbox" checked />
          New Order
        </label>
        <p>Send to: admin@example.com</p>
      </div>
      <div class="notification-item">
        <label>
          <input type="checkbox" />
          Low Stock Warning
        </label>
        <p>Send to: inventory@example.com</p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>

<style scoped>
.notification-item{align-items:center;display:flex;gap:1rem;margin-top:.5rem}
</style>
