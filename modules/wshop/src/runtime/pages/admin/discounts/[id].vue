<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">{{ isNew ? 'Create Discount' : 'Edit Discount' }}</h1>
    <DiscountForm :discount="discount || undefined" :is-saving="isSaving" @save="saveDiscount" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DiscountForm from '~/components/admin/discounts/DiscountForm.vue';
import type { Discount } from '#shared/types';

const route = useRoute();
const router = useRouter();
const discountId = route.params.id as string;
const isNew = discountId === 'new';

const discount = ref<Discount | null>(null)

const isSaving = ref(false);

onMounted(async () => {
  if (!isNew) {
    const { data } = await useFetch<Discount>(`/api/discounts/${discountId}`);
    if (data.value) {
      discount.value = data.value;
    }
  }
});

const saveDiscount = async () => {
  isSaving.value = true;
  try {
    if (isNew) {
      await $fetch('/api/discounts', { method: 'POST', body: discount.value });
    } else {
      await $fetch(`/api/discounts/${discountId}`, { method: 'PUT', body: discount.value });
    }
    router.push('/admin/discounts');
  } catch (error) {
    console.error('Failed to save discount:', error);
    // TODO: Show error notification to user
  } finally {
    isSaving.value = false;
  }
};
</script>
