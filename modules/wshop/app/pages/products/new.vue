<script setup lang="ts">
import { useProductForm } from '~/composables/inventory/useProductForm';

const { name, price, stock, errors, onSubmit } = useProductForm();
</script>

<template>


	<div>
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-semibold">Add New Product</h1>
			<NuxtLink to="/products" class="text-gray-600 hover:underline"
			>Cancel</NuxtLink>
		</div>

		<Card>
			<ProductForm
				v-model:name="name"
				v-model:price="(price as any)"
				v-model:stock="stock"
				:errors="errors"
				@submit="onSubmit"
			>
				<template #submit-button>Add Product</template>
			</ProductForm>
		</Card>
	</div>
</template>
