<script lang="ts" setup>
import { useOrders } from '~/composables/useOrders';

const { orders, deleteOrder } = useOrders();
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
					Orders
				</h1>
				<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
					A list of all the orders in your account including their customer, status, and total.
				</p>
			</div>
			<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<NuxtLink
					to="/orders/new"
					class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Add order</NuxtLink>
			</div>
		</div>
		<div class="mt-8 flow-root">
			<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
				<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
					<table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
						<thead>
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
								>
									Order ID
								</th>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
								>
									Customer
								</th>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
								>
									Status
								</th>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
								>
									Total
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span class="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-gray-800">
							<tr v-for="order in orders" :key="order.id">
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
									#{{ order.id }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
									{{ order.customer.name }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
									<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
									:class="{
										'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 ring-green-600/20': order.status === 'Delivered',
										'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 ring-blue-600/20': order.status === 'Shipped',
										'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 ring-yellow-600/20': order.status === 'Processing',
										'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 ring-gray-600/20': order.status === 'Pending',
										'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 ring-red-600/20': order.status === 'Cancelled',
									}">
										{{ order.status }}
									</span>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
									${{ order.total.toFixed(2) }}
								</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
									<NuxtLink
										:to="`/orders/${order.id}/edit`"
										class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
									>Edit<span class="sr-only">, Order #{{ order.id }}</span></NuxtLink>
									<button
										@click="deleteOrder(parseInt(order.id))"
										class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
									>
										Delete<span class="sr-only">, Order #{{ order.id }}</span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
