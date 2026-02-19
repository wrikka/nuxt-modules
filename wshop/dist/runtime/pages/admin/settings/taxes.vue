<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Taxes</h1>
      <button>Save</button>
    </header>

    <section>
      <h2>Tax Regions</h2>
      <button>Add Tax Region</button>
      <div>
        <h3>Thailand</h3>
        <p>7% VAT</p>
        <button>Edit</button>
      </div>
    </section>

    <section>
      <h2>Tax Calculation</h2>
      <div>
        <label>
          <input type="checkbox" checked />
          All prices include tax
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" />
          Charge tax on shipping rates
        </label>
      </div>
    </section>

    <section>
      <h2>Tax Numbers</h2>
      <div>
        <label>VAT Registration Number</label>
        <input type="text" placeholder="Enter your VAT number" />
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>
