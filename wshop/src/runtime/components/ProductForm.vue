<script setup lang="ts">
import type { FormErrors } from "vee-validate";
import type { Product } from "#shared/types";

defineProps<{
	errors: FormErrors<Record<string, any>>;
}>();

const name = defineModel<string>("name");
const price = defineModel<string>("price");
const stock = defineModel<number>("stock");

const emit = defineEmits(["submit"]);

function onSubmit() {
	emit("submit");
}
</script>

<template>


	<form @submit.prevent="onSubmit">
		<div class="space-y-6">
			<div>
				<label
					for="product-name"
					class="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>Product Name</label>
				<input
					v-model="name"
					type="text"
					id="product-name"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				>
				<p v-if="errors.name" class="mt-2 text-sm text-red-600">
					{{ errors.name }}
				</p>
			</div>
			<div>
				<label
					for="price"
					class="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>Price</label>
				<input
					v-model="price"
					type="number"
					id="price"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				>
				<p v-if="errors.price" class="mt-2 text-sm text-red-600">
					{{ errors.price }}
				</p>
			</div>
			<div>
				<label
					for="stock"
					class="block text-sm font-medium text-gray-700 dark:text-gray-200"
				>Stock</label>
				<input
					v-model="stock"
					type="number"
					id="stock"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
				>
				<p v-if="errors.stock" class="mt-2 text-sm text-red-600">
					{{ errors.stock }}
				</p>
			</div>
		</div>
		<div class="mt-8 flex justify-end">
			<button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg">
				<slot name="submit-button">Save</slot>
			</button>
		</div>
	</form>


</template>
