<script setup lang="ts">
import AdminPageHeader from '~/components/admin/ui/AdminPageHeader.vue';
import AdminPageLayout from '~/components/admin/ui/AdminPageLayout.vue';
import AdminCard from '~/components/admin/ui/AdminCard.vue';
import { useProductEditor } from '~/composables/useProductEditor';

definePageMeta({ layout: 'admin' });

const { 
  product, 
  productId, 
  isNew, 
  isSaving, 
  pending, 
  saveProduct, 
  refreshProduct 
} = useProductEditor();

</script>

<template>
  <div class="p-8">
    <AdminPageHeader :title="isNew ? 'Create Product' : 'Edit Product'" />

    <div v-if="pending && !isNew">
      <p>Loading product...</p>
    </div>
    <form v-else @submit.prevent="saveProduct" class="space-y-8">
      <AdminPageLayout>
        <template #main>
          <AdminCard title="Product Information">
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" id="name" v-model="product.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" v-model="product.description" rows="6" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Pricing" v-if="product.type === 'physical' && (!product.variants || product.variants.length === 0)">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
              <input type="text" id="price" v-model="product.price" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
          </AdminCard>

          <!-- Digital Files Manager -->
          <DigitalFileManager 
            v-if="product.type === 'digital' && !isNew"
            :product-id="productId"
            :files="(product as any).digitalFiles || []"
            @update="refreshProduct"
          />

          <!-- Variants & Options for Physical Products -->
          <div v-if="product.type === 'physical' && !isNew">
            <ProductOptionsManager 
              :product-id="productId" 
              :options="product.options || []" 
              @update:options="refreshProduct"
            />
            <ProductVariantsManager 
              :product-id="productId" 
              :options="product.options || []" 
              :variants="product.variants || []"
              @update:variants="refreshProduct"
            />
          </div>
        </template>

        <template #sidebar>
          <AdminCard title="Product Status">
            <select v-model="product.status" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </AdminCard>
          <AdminCard title="Product Type">
            <select v-model="product.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" :disabled="!isNew">
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
            <p v-if="!isNew" class="text-xs text-gray-500 mt-2">Product type cannot be changed after creation.</p>
          </AdminCard>
        </template>
      </AdminPageLayout>

      <div class="flex justify-end space-x-4">
        <NuxtLink to="/admin/products" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</NuxtLink>
        <button type="submit" :disabled="isSaving" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
          {{ isSaving ? 'Saving...' : 'Save Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

