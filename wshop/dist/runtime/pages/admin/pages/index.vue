<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Page Management</h1>

    <div class="flex justify-end mb-4">
      <NuxtLink to="/admin/pages/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Page
      </NuxtLink>
    </div>

    <AdminPagesLoading v-if="pending" />
    <AdminPagesError v-else-if="error" :error="error" />
    <PagesTable v-else :pages="pages" />
  </div>
</template>

<script setup>
import PagesTable from "~/components/admin/pages/PagesTable.vue";
import AdminPagesLoading from "~/components/admin/pages/AdminPagesLoading.vue";
import AdminPagesError from "~/components/admin/pages/AdminPagesError.vue";
const { data: pages, pending, error } = await useFetch("/api/pages", { default: () => [] });
</script>
