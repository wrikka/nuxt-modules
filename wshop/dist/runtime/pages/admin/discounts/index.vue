<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Discount Management</h1>

    <div class="flex justify-end mb-4">
      <NuxtLink to="/admin/discounts/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Discount
      </NuxtLink>
    </div>

    <AdminDiscountsLoading v-if="pending" />
    <AdminDiscountsError v-else-if="error" :error="error" />
    <DiscountsTable v-else :discounts="discounts" />
  </div>
</template>

<script setup>
import DiscountsTable from "~/components/admin/discounts/DiscountsTable.vue";
import AdminDiscountsLoading from "~/components/admin/discounts/AdminDiscountsLoading.vue";
import AdminDiscountsError from "~/components/admin/discounts/AdminDiscountsError.vue";
const { data: discounts, pending, error } = await useFetch("/api/discounts", { default: () => [] });
</script>
