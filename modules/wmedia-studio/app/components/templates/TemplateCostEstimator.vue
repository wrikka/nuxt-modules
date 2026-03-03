<script setup lang="ts">
const emit = defineEmits<{
	(e: "close"): void;
}>();

interface CostItem {
	id: string;
	name: string;
	type: "digital" | "print";
	basePrice: number;
	unit: string;
	quantity: number;
}

const costItems = ref<CostItem[]>([
	{
		id: "1",
		name: "Digital Download",
		type: "digital",
		basePrice: 0,
		unit: "download",
		quantity: 1,
	},
	{
		id: "2",
		name: "A4 Print (Standard)",
		type: "print",
		basePrice: 2.5,
		unit: "page",
		quantity: 1,
	},
	{
		id: "3",
		name: "A4 Print (Premium)",
		type: "print",
		basePrice: 4.5,
		unit: "page",
		quantity: 1,
	},
	{
		id: "4",
		name: "Business Card (100pcs)",
		type: "print",
		basePrice: 25,
		unit: "set",
		quantity: 1,
	},
	{
		id: "5",
		name: "Poster (A2)",
		type: "print",
		basePrice: 15,
		unit: "piece",
		quantity: 1,
	},
	{
		id: "6",
		name: "Banner (Vinyl)",
		type: "print",
		basePrice: 35,
		unit: "sqm",
		quantity: 1,
	},
]);

const selectedItems = ref<string[]>(["1"]);
const currency = ref("USD");
const includeTax = ref(true);
const taxRate = ref(10);
const deliveryMethod = ref("standard");

const currencySymbols: Record<string, string> = {
	USD: "$",
	EUR: "€",
	GBP: "£",
	THB: "฿",
	JPY: "¥",
};

const subtotal = computed(() => {
	return selectedItems.value.reduce((sum, id) => {
		const item = costItems.value.find(i => i.id === id);
		return sum + (item ? item.basePrice * item.quantity : 0);
	}, 0);
});

const tax = computed(() =>
	includeTax.value ? subtotal.value * (taxRate.value / 100) : 0
);
const deliveryFee = computed(() => {
	if (deliveryMethod.value === "express") return 15;
	if (deliveryMethod.value === "same-day") return 35;
	return selectedItems.value.some(id =>
			costItems.value.find(i => i.id === id)?.type === "print"
		)
		? 5
		: 0;
});
const total = computed(() => subtotal.value + tax.value + deliveryFee.value);

const toggleItem = (id: string) => {
	const index = selectedItems.value.indexOf(id);
	if (index > -1) {
		selectedItems.value.splice(index, 1);
	} else {
		selectedItems.value.push(id);
	}
};

const formatPrice = (price: number) => {
	return `${currencySymbols[currency.value]}${price.toFixed(2)}`;
};

const printLocations = [
	{
		name: "Local Print Shop",
		distance: "0.5 miles",
		rating: 4.5,
		priceMultiplier: 1,
	},
	{
		name: "QuickPrint Center",
		distance: "1.2 miles",
		rating: 4.2,
		priceMultiplier: 0.9,
	},
	{
		name: "Professional Prints",
		distance: "2.5 miles",
		rating: 4.8,
		priceMultiplier: 1.2,
	},
];

const selectedLocation = ref(printLocations[0]);
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-calculator text-green-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Cost Estimator
							</h2>
							<p class="text-sm text-gray-500">
								Calculate export and printing costs
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<select
							v-model="currency"
							class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm"
						>
							<option value="USD">USD ($)</option>
							<option value="EUR">EUR (€)</option>
							<option value="GBP">GBP (£)</option>
							<option value="THB">THB (฿)</option>
							<option value="JPY">JPY (¥)</option>
						</select>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Options -->
					<div class="flex-1 overflow-y-auto p-6">
						<div class="max-w-2xl mx-auto space-y-6">
							<!-- Output Types -->
							<div>
								<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
									Select Output
								</h3>
								<div class="space-y-2">
									<label
										v-for="item in costItems"
										:key="item.id"
										class="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors"
										:class="selectedItems.includes(item.id)
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
									>
										<input
											type="checkbox"
											:checked="selectedItems.includes(item.id)"
											class="w-5 h-5 rounded border-gray-300 text-blue-600"
											@change="toggleItem(item.id)"
										/>
										<div class="flex-1">
											<div class="flex items-center gap-2">
												<span
													class="font-medium text-gray-900 dark:text-white"
												>{{ item.name }}</span>
												<span
													class="px-2 py-0.5 text-xs rounded-full"
													:class="item.type === 'digital'
													? 'bg-blue-100 text-blue-700'
													: 'bg-orange-100 text-orange-700'"
												>
													{{ item.type }}
												</span>
											</div>
											<div class="text-sm text-gray-500 mt-1">
												{{ formatPrice(item.basePrice) }} / {{ item.unit }}
											</div>
										</div>
										<input
											v-if="selectedItems.includes(item.id)"
											v-model.number="item.quantity"
											type="number"
											min="1"
											class="w-20 px-2 py-1 text-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
										/>
									</label>
								</div>
							</div>

							<!-- Print Options (if print selected) -->
							<div
								v-if="selectedItems.some((id: string) =>
									costItems.find((i: CostItem) => i.id === id)?.type === 'print'
								)"
								class="space-y-4"
							>
								<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
									Print Options
								</h3>

								<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-4">
									<div>
										<label class="text-xs text-gray-500 uppercase mb-1 block"
										>Print Location</label>
										<select
											v-model="selectedLocation"
											class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
										>
											<option
												v-for="loc in printLocations"
												:key="loc.name"
												:value="loc"
											>
												{{ loc.name }} ({{ loc.distance }})
											</option>
										</select>
									</div>

									<div>
										<label class="text-xs text-gray-500 uppercase mb-1 block"
										>Delivery</label>
										<div class="flex gap-2">
											<button
												v-for='method in ["standard", "express", "same-day"]'
												:key="method"
												class="flex-1 px-3 py-2 text-sm rounded-lg border capitalize transition-colors"
												:class="deliveryMethod === method
												? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
												: 'border-gray-300 dark:border-gray-600'"
												@click="deliveryMethod = method"
											>
												{{ method }}
											</button>
										</div>
									</div>
								</div>
							</div>

							<!-- Tax Settings -->
							<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
								<label class="flex items-center gap-2">
									<input
										v-model="includeTax"
										type="checkbox"
										class="w-5 h-5 rounded border-gray-300 text-blue-600"
									/>
									<span
										class="text-sm font-medium text-gray-700 dark:text-gray-300"
									>Include Tax</span>
								</label>
								<input
									v-if="includeTax"
									v-model.number="taxRate"
									type="number"
									min="0"
									max="50"
									class="w-20 px-2 py-1 text-right bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
								/>
								<span v-if="includeTax" class="text-gray-500">%</span>
							</div>
						</div>
					</div>

					<!-- Right: Summary -->
					<div class="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Cost Summary
						</h3>

						<div class="space-y-3 mb-6">
							<div
								v-for="id in selectedItems"
								:key="id"
								class="flex justify-between text-sm"
							>
								<span class="text-gray-600 dark:text-gray-400">
									{{ costItems.find(i => i.id === id)?.name }}
									<span
										v-if="costItems.find(i => i.id === id)?.quantity! > 1"
										class="text-gray-400"
									>
										(x{{ costItems.find(i => i.id === id)?.quantity }})
									</span>
								</span>
								<span class="text-gray-900 dark:text-white">
									{{
										formatPrice(
											(costItems.find(i => i.id === id)?.basePrice || 0)
												* (costItems.find(i => i.id === id)?.quantity || 1),
										)
									}}
								</span>
							</div>
						</div>

						<div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600 dark:text-gray-400">Subtotal</span>
								<span class="text-gray-900 dark:text-white">{{
									formatPrice(subtotal)
								}}</span>
							</div>
							<div v-if="includeTax" class="flex justify-between text-sm">
								<span class="text-gray-600 dark:text-gray-400"
								>Tax ({{ taxRate }}%)</span>
								<span class="text-gray-900 dark:text-white">{{
									formatPrice(tax)
								}}</span>
							</div>
							<div v-if="deliveryFee > 0" class="flex justify-between text-sm">
								<span class="text-gray-600 dark:text-gray-400">Delivery</span>
								<span class="text-gray-900 dark:text-white">{{
									formatPrice(deliveryFee)
								}}</span>
							</div>
						</div>

						<div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
							<div class="flex justify-between items-center">
								<span
									class="text-lg font-semibold text-gray-900 dark:text-white"
								>Total</span>
								<span class="text-2xl font-bold text-blue-600">{{
									formatPrice(total)
								}}</span>
							</div>
						</div>

						<button class="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
							<i class="i-mdi-cart mr-1" />
							Proceed to Checkout
						</button>

						<p class="text-xs text-gray-500 text-center mt-4">
							Prices are estimates. Final cost may vary based on actual print
							specifications.
						</p>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
