<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Languages</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Store Languages</h2>
      <p>Manage the languages available on your storefront.</p>
      <button>Add Language</button>

      <div class="language-item">
        <h3>English (Default)</h3>
        <p>Published</p>
        <button>Manage Translations</button>
      </div>

      <div class="language-item">
        <h3>Thai</h3>
        <p>Published</p>
        <button>Manage Translations</button>
      </div>

      <div class="language-item">
        <h3>Japanese</h3>
        <p>Unpublished</p>
        <button>Publish</button>
        <button>Manage Translations</button>
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
.language-item {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
</style>
