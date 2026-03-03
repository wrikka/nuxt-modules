<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Order Workflows</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Automation Rules</h2>
      <button>Add New Rule</button>

      <div class="rule-card">
        <h3>Rule: Auto-archive paid orders</h3>
        <p><strong>Trigger:</strong> When an order is paid.</p>
        <p><strong>Action:</strong> Archive the order.</p>
        <button>Edit</button>
      </div>

      <div class="rule-card">
        <h3>Rule: Notify high-risk orders</h3>
        <p><strong>Trigger:</strong> When an order is flagged as high-risk.</p>
        <p><strong>Action:</strong> Send an email to the admin.</p>
        <button>Edit</button>
      </div>

      <div class="rule-card">
        <h3>Rule: Tag orders from specific countries</h3>
        <p><strong>Trigger:</strong> When an order is placed from USA or Canada.</p>
        <p><strong>Action:</strong> Add tag 'North America'.</p>
        <button>Edit</button>
      </div>
    </section>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'admin',
  });
</script>

<style scoped>
.rule-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
