<script setup lang="ts">
const showData = ref(false);

const collections = ref([
	{ id: "1", name: "Blog Posts", count: 24 },
	{ id: "2", name: "Products", count: 156 },
	{ id: "3", name: "Testimonials", count: 48 },
]);

const selectedCollection = ref<string>("");
const bindMode = ref<"single" | "list" | "grid">("single");
</script>

<template>
	<div>
		<button
			class="fixed left-20 top-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-emerald-400 ring-offset-2': showData }"
			@click="showData = !showData"
			title="Data Binding"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<ellipse cx="12" cy="5" rx="9" ry="3" />
				<path d="M3 5V19A9 3 0 0 0 21 19V5" />
				<path d="M3 12A9 3 0 0 0 21 12" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="-translate-x-full opacity-0"
			enter-to-class="translate-x-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-x-0 opacity-100"
			leave-to-class="-translate-x-full opacity-0"
		>
			<div
				v-if="showData"
				class="fixed left-0 top-0 z-40 h-screen w-80 overflow-hidden border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-emerald-600 p-4 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h2 class="font-bold text-white">Data</h2>
						<button
							class="text-white/80 hover:text-white"
							@click="showData = false"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="h-[calc(100vh-80px)] overflow-y-auto p-4">
					<!-- Collections -->
					<div class="mb-6">
						<h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
							Collections
						</h3>
						<div class="space-y-2">
							<div
								v-for="collection in collections"
								:key="collection.id"
								class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 transition-colors hover:border-emerald-500 dark:border-gray-700"
								:class="{
									'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20':
										selectedCollection === collection.id,
								}"
								@click="selectedCollection = collection.id"
							>
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-emerald-600"
										>
											<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
										</svg>
									</div>
									<div>
										<p class="font-medium text-gray-900 dark:text-white">
											{{ collection.name }}
										</p>
										<p class="text-xs text-gray-500">
											{{ collection.count }} items
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Bind Mode -->
					<div
						v-if="selectedCollection"
						class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
					>
						<h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">
							Bind Mode
						</h3>
						<div class="flex gap-2">
							<button
								v-for='mode in ["single", "list", "grid"] as const'
								:key="mode"
								class="flex-1 rounded-lg border py-2 text-xs font-medium capitalize"
								:class="bindMode === mode
								? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20'
								: 'border-gray-200 dark:border-gray-700'"
								@click="bindMode = mode"
							>
								{{ mode }}
							</button>
						</div>
					</div>

					<button class="mt-6 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700">
						Bind to Selected Element
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
