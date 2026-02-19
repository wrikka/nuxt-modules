<script setup>
import { useCustomers } from "~/composables/useCustomers";
const { customers, deleteCustomer } = useCustomers();
</script>

<template>
	<div class="p-4 sm:p-6 lg:p-8">
		<div class="sm:flex sm:items-center">
			<div class="sm:flex-auto">
				<h1 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
					Customers
				</h1>
				<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
					A list of all the customers in your account including their name,
					email, and country.
				</p>
			</div>
			<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<NuxtLink
					to="/customers/new"
					class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>Add customer</NuxtLink>
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
									Name
								</th>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
								>
									Spent
								</th>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
								>
									Country
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
									<span class="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 dark:divide-gray-800">
							<tr v-for="customer in customers" :key="customer.id">
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
									<div class="flex items-center">
										<div class="h-10 w-10 flex-shrink-0">
											<img class="h-10 w-10 rounded-full" :src="customer.avatar" alt="" />
										</div>
										<div class="ml-4">
											<div class="font-medium text-gray-900 dark:text-white">{{ customer.name }}</div>
											<div class="text-gray-500 dark:text-gray-400">{{ customer.email }}</div>
										</div>
									</div>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
									{{ customer.spent }}
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
									{{ customer.country }}
								</td>
								<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
									<NuxtLink
										:to="`/customers/${customer.id}/edit`"
										class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
									>Edit<span class="sr-only">, {{ customer.name }}</span></NuxtLink>
									<button
										@click="deleteCustomer(customer.id)"
										class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
									>
										Delete<span class="sr-only">, {{ customer.name }}</span>
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
