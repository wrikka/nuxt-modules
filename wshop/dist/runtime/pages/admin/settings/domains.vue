<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Domains & CDN</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Primary Domain</h2>
      <p>your-shop.wshop.com</p>
      <p>This is the main address for your storefront.</p>
    </section>

    <section>
      <h2>Custom Domains</h2>
      <button>Connect Existing Domain</button>
      <div class="domain-item">
        <p>www.your-awesome-shop.com</p>
        <p>Connected</p>
        <button>Manage</button>
      </div>
    </section>

    <section>
      <h2>CDN Configuration</h2>
      <div>
        <label>
          <input type="checkbox" checked />
          Enable Content Delivery Network (CDN)
        </label>
        <p>Improves loading speed for international customers.</p>
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
.domain-item{border:1px solid #ccc;margin-top:1rem;padding:1rem}
</style>
