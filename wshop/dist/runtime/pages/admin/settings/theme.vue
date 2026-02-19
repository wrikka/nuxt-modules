<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Theme Customization</h1>
      <button>Save</button>
    </header>

    <div class="theme-editor">
      <div class="preview-panel">
        <AdminSettingsThemePreview />
      </div>

      <div class="controls-panel">
        <section>
          <h2>Colors</h2>
          <label>Primary Color</label>
          <input type="color" value="#007bff" />

          <label>Secondary Color</label>
          <input type="color" value="#6c757d" />

          <label>Background Color</label>
          <input type="color" value="#ffffff" />

          <label>Text Color</label>
          <input type="color" value="#212529" />
        </section>

        <section>
          <h2>Typography</h2>
          <label>Heading Font</label>
          <select>
            <option>Georgia, serif</option>
            <option>"Palatino Linotype", "Book Antiqua", Palatino, serif</option>
            <option>"Times New Roman", Times, serif</option>
          </select>

          <label>Body Font</label>
          <select>
            <option>Arial, Helvetica, sans-serif</option>
            <option>"Arial Black", Gadget, sans-serif</option>
            <option>"Comic Sans MS", cursive, sans-serif</option>
          </select>
        </section>

        <section>
          <h2>Layout</h2>
          <label>Header Layout</label>
          <select>
            <option>Standard</option>
            <option>Centered</option>
            <option>Minimal</option>
          </select>

          <label>Product Grid</label>
          <select>
            <option>3 columns</option>
            <option>4 columns</option>
            <option>5 columns</option>
          </select>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>

<style scoped>
.theme-editor{display:flex;gap:2rem}.preview-panel{flex-grow:1}.shop-preview{align-items:center;background:#f0f0f0;border:1px solid #ccc;display:flex;height:600px;justify-content:center}.controls-panel{width:300px}
</style>
