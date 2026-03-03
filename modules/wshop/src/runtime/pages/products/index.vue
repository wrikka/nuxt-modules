<script setup lang="ts">
</script>

<template>


	<div class="p-4 sm:p-6 lg:p-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
					Products
				</h1>
				<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
					A list of all the products in your account including their name,
					price, status, and inventory.
				</p>
			</div>
			<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<NuxtLink
					to="/products/new"
					class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Add product</NuxtLink>
			</div>
		</div>
		<div class="mt-8 flow-root">
			<ProductTable />
		</div>
	</div>


</template>
