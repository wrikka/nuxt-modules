<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Shop Profile</h1>
      <button>Save</button>
    </header>

    <form>
      <section>
        <h2>Basic Information</h2>
        <label>Shop Name</label>
        <input type="text" placeholder="My Awesome Shop" />

        <label>Shop Logo</label>
        <input type="file" />

        <label>Shop Banner</label>
        <input type="file" />

        <label>Shop Description</label>
        <textarea placeholder="Tell us about your shop..."></textarea>
      </section>

      <section>
        <h2>Contact & Address</h2>
        <label>Email</label>
        <input type="email" placeholder="contact@example.com" />

        <label>Phone</label>
        <input type="tel" placeholder="+123456789" />

        <label>Address</label>
        <input type="text" placeholder="Street Address" />
        <input type="text" placeholder="City" />
        <input type="text" placeholder="Postal Code" />
        <input type="text" placeholder="Country" />
      </section>

      <section>
        <h2>Social Links</h2>
        <label>Facebook</label>
        <input type="url" placeholder="https://facebook.com/yourshop" />

        <label>Instagram</label>
        <input type="url" placeholder="https://instagram.com/yourshop" />

        <label>Twitter</label>
        <input type="url" placeholder="https://twitter.com/yourshop" />
      </section>

      <section>
        <h2>SEO Settings</h2>
        <label>Meta Title</label>
        <input type="text" placeholder="My Awesome Shop - High-Quality Products" />

        <label>Meta Description</label>
        <textarea placeholder="Discover amazing products at My Awesome Shop. Best prices, fast shipping."></textarea>
      </section>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>
