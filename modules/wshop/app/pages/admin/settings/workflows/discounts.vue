<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Discount & Promotion Rules</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Automatic Discounts</h2>
      <button>Create Automatic Discount</button>

      <div class="discount-card">
        <h3>Free Shipping on orders over ฿1,500</h3>
        <p><strong>Type:</strong> Automatic</p>
        <p><strong>Status:</strong> Active</p>
        <button>Edit</button>
      </div>
    </section>

    <section>
      <h2>Coupon Codes</h2>
      <button>Create Coupon Code</button>

      <div class="discount-card">
        <h3>WELCOME10</h3>
        <p><strong>Type:</strong> 10% off entire order</p>
        <p><strong>Uses:</strong> 142</p>
        <p><strong>Status:</strong> Active</p>
        <button>Edit</button>
      </div>

      <div class="discount-card">
        <h3>SUMMERSALE</h3>
        <p><strong>Type:</strong> ฿200 off selected products</p>
        <p><strong>Uses:</strong> 58</p>
        <p><strong>Status:</strong> Expired</p>
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
.discount-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
