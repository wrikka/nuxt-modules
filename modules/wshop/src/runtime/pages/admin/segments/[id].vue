<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter, definePageMeta, useFetch } from '#imports';
import type { Segment } from '#shared/types';

definePageMeta({ layout: 'admin' });

const route = useRoute();
const router = useRouter();
const segmentId = route.params.id as string;

const { data: segment, pending } = await useFetch<Segment>(`/api/segments/${segmentId}`);

const error = ref<string | null>(null);
const isLoading = ref(false);

if (!pending.value && !segment.value) {
  throw createError({ statusCode: 404, statusMessage: 'Segment not found', fatal: true });
}

const handleUpdate = async (segmentData: Partial<Segment>) => {
  isLoading.value = true;
  error.value = null;
  try {
    await $fetch(`/api/segments/${segmentId}`, {
      method: 'PUT',
      body: segmentData,
    });
    await router.push('/admin/segments');
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to update segment.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Edit Segment</h1>
      <NuxtLink to="/admin/segments" class="text-gray-600 hover:underline">Cancel</NuxtLink>
    </div>

    <div v-if="pending">
      <p>Loading segment data...</p>
    </div>
    
    <div v-else>
      <AdminSegmentsSegmentForm :segment="segment" :is-loading="isLoading" @submit="handleUpdate" />
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>
  </div>
</template>
