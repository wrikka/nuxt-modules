<template>
  <div>
    <header>
      <NuxtLink to="/admin/settings">Back to Settings</NuxtLink>
      <h1>Staff & Permissions</h1>
      <button>Add Staff Member</button>
    </header>

    <section>
      <h2>Staff Accounts</h2>
      <div class="staff-member">
        <p><strong>Alice Smith</strong> (alice@example.com)</p>
        <p>Role: Admin</p>
        <button>Edit Permissions</button>
      </div>
      <div class="staff-member">
        <p><strong>Bob Johnson</strong> (bob@example.com)</p>
        <p>Role: Order Manager</p>
        <button>Edit Permissions</button>
      </div>
      <div class="staff-member">
        <p><strong>Charlie Brown</strong> (charlie@example.com)</p>
        <p>Role: Content Editor</p>
        <button>Edit Permissions</button>
      </div>
    </section>

    <section>
      <h2>Roles & Permissions</h2>
      <button>Create New Role</button>
      <div class="role">
        <h3>Admin</h3>
        <p>Full access to all parts of the admin panel.</p>
      </div>
      <div class="role">
        <h3>Order Manager</h3>
        <p>Can view, edit, and fulfill orders.</p>
      </div>
      <div class="role">
        <h3>Content Editor</h3>
        <p>Can manage products, collections, and pages.</p>
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
.role,.staff-member{border:1px solid #ccc;margin-top:1rem;padding:1rem}
</style>
