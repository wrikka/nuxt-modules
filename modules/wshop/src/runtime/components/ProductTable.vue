<script setup lang="ts">
import { useProducts } from '~/composables/inventory/useProducts';
import { useConfirmationDialog } from '~/composables/core/useConfirmationDialog';

const { products, pending, error, deleteProduct, formatPrice } = useProducts();
const { reveal } = useConfirmationDialog()

async function handleDeleteConfirmation(id: string, name: string) {
  const { isCanceled } = await reveal({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete the product "<strong>${name}</strong>"?<br><br><span class="text-red-600">This action cannot be undone.</span>`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    isDestructive: true,
  })

  if (isCanceled) return

  deleteProduct(id)
}
</script>

<template>


	<div class="overflow-x-auto">
		<div v-if="pending" class="text-center p-8">
			<p>Loading products...</p>
		</div>
		<div v-else-if="error" class="text-center p-8 text-red-500">
			<p>Failed to load products. Please try again.</p>
		</div>
		<table
			v-else-if="products && products.length"
			class="min-w-full text-sm align-middle whitespace-nowrap"
		>
			<thead class="text-left text-gray-500 dark:text-gray-400">
				<tr>
					<th class="p-4">Product</th>
					<th class="p-4">Price</th>
					<th class="p-4">Status</th>
					<th class="p-4">Inventory</th>
					<th class="p-4"></th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="product in products"
					:key="product.id"
					class="border-t border-gray-200 dark:border-gray-700"
				>
					<td class="p-4 font-medium text-gray-900 dark:text-white">
						{{ product.name }}
					</td>
					<td class="p-4">{{ formatPrice(product.price) }}</td>
					<td class="p-4">
						<span
							:class="product.status === 'active'
							? 'bg-green-100 text-green-800'
							: 'bg-gray-100 text-gray-800'"
							class="px-2 py-1 text-xs font-medium rounded-full"
						>{{ product.status }}</span>
					</td>
					<td class="p-4">{{ product.variants?.[0]?.stock ?? 0 }} in stock</td>
					<td class="p-4 text-right">
						<NuxtLink
							:to="`/products/${product.id}/edit`"
							class="font-medium text-gray-600 dark:text-gray-400 hover:underline"
						>Edit</NuxtLink>
						<button
							@click="handleDeleteConfirmation(product.id, product.name)"
							class="ml-4 font-medium text-red-600 dark:text-red-500 hover:underline"
						>
							Delete
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<div v-else class="text-center p-8">
			<p>No products found.</p>
		</div>
	</div>


</template>
