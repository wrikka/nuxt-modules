<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Customer Segmentation</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Segments</h2>
      <button>Create New Segment</button>

      <div class="segment-card">
        <h3>High-Value Customers</h3>
        <p><strong>Criteria:</strong> Total spend is greater than ฿10,000.</p>
        <p><strong>Customers:</strong> 42</p>
        <button>View Customers</button>
        <button>Edit</button>
      </div>

      <div class="segment-card">
        <h3>New Customers</h3>
        <p><strong>Criteria:</strong> First purchase was in the last 30 days.</p>
        <p><strong>Customers:</strong> 128</p>
        <button>View Customers</button>
        <button>Edit</button>
      </div>

      <div class="segment-card">
        <h3>Inactive Customers</h3>
        <p><strong>Criteria:</strong> Has not purchased in the last 180 days.</p>
        <p><strong>Customers:</strong> 87</p>
        <button>View Customers</button>
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
.segment-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
