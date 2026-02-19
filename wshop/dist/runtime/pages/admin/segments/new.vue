<script setup>
import { ref } from "vue";
import { useRouter, definePageMeta } from "#imports";
definePageMeta({ layout: "admin" });
const router = useRouter();
const error = ref(null);
const isLoading = ref(false);
const handleCreate = async (segmentData) => {
  isLoading.value = true;
  error.value = null;
  try {
    await $fetch("/api/segments", {
      method: "POST",
      body: segmentData
    });
    await router.push("/admin/segments");
  } catch (err) {
    error.value = err.data?.message || "Failed to create segment.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Create New Segment</h1>
      <NuxtLink to="/admin/segments" class="text-gray-600 hover:underline">Cancel</NuxtLink>
    </div>
    <AdminSegmentsSegmentForm :is-loading="isLoading" @submit="handleCreate" />
    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
  </div>
</template>
