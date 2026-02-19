<script setup>
import { definePageMeta } from "#imports";
import { useSegments } from "~/composables/useSegments";
definePageMeta({ layout: "admin" });
const { segments, pending, error, deleteSegment } = useSegments();
const handleDelete = async (segmentId) => {
  if (!confirm("Are you sure you want to delete this segment?")) return;
  try {
    await deleteSegment(segmentId);
  } catch (err) {
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Customer Segments</h1>
      <NuxtLink to="/admin/segments/new" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Segment
      </NuxtLink>
    </div>

    <div v-if="pending">
      <p>Loading segments...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Failed to load segments.</p>
    </div>
    <div v-else-if="!segments || segments.length === 0">
        <p class="text-gray-500">No customer segments found. Create one to get started.</p>
    </div>
    <AdminSegmentsSegmentList v-else :segments="segments" @delete="handleDelete" />
  </div>
</template>
