<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Analytics</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Google Analytics</h2>
      <div>
        <label>Google Analytics Measurement ID</label>
        <input type="text" placeholder="G-XXXXXXXXXX" />
      </div>
    </section>

    <section>
      <h2>Facebook Pixel</h2>
      <div>
        <label>Facebook Pixel ID</label>
        <input type="text" placeholder="Your Pixel ID" />
      </div>
    </section>

    <section>
      <h2>Custom Tracking Scripts</h2>
      <div>
        <label>Header Scripts</label>
        <textarea placeholder="Paste your scripts here. They will be added to the <head> tag."></textarea>
      </div>
      <div>
        <label>Footer Scripts</label>
        <textarea placeholder="Paste your scripts here. They will be added before the closing </body> tag."></textarea>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>
