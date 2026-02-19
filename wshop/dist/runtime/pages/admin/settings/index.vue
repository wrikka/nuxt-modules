<template>
  <div>
    <h1>Shop Settings</h1>
    <p>Manage your shop's settings, profile, and workflows.</p>
    
    <ul>
      <li><NuxtLink to="/admin/settings/profile">Shop Profile</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/theme">Theme Customization</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/payments">Payment Gateways</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/shipping">Shipping & Delivery</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/taxes">Taxes</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/languages">Languages</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/domains">Domains</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/analytics">Analytics</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/staff">Staff Permissions</NuxtLink></li>
    </ul>

    <h2>Workflows & Automations</h2>
    <ul>
      <li><NuxtLink to="/admin/settings/workflows/orders">Order Workflows</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/workflows/emails">Email Notifications</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/workflows/customers">Customer Segmentation</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/workflows/discounts">Discount Rules</NuxtLink></li>
      <li><NuxtLink to="/admin/settings/workflows/inventory">Inventory Alerts</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin"
});
</script>
