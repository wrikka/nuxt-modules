<script setup lang="ts">
const showVariants = ref(false);
const selectedVariant = ref("default");

const variants = [
	{ id: "default", name: "Default", icon: "square" },
	{ id: "hover", name: "Hover", icon: "mouse-pointer" },
	{ id: "active", name: "Active", icon: "zap" },
	{ id: "disabled", name: "Disabled", icon: "ban" },
	{ id: "loading", name: "Loading", icon: "loader" },
	{ id: "error", name: "Error", icon: "alert-circle" },
];

const addVariant = () => {
	// TODO: Implement add variant
};

const duplicateVariant = (id: string) => {
	// TODO: Implement duplicate variant
};

const deleteVariant = (id: string) => {
	// TODO: Implement delete variant
};
</script>

<template>
	<div>
		<!-- Floating Action Button -->
		<button
			class="fixed right-4 bottom-20 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-indigo-400 ring-offset-2': showVariants }"
			@click="showVariants = !showVariants"
			title="Component Variants"
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
				<rect x="3" y="3" width="7" height="7" />
				<rect x="14" y="3" width="7" height="7" />
				<rect x="14" y="14" width="7" height="7" />
				<rect x="3" y="14" width="7" height="7" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="translate-y-full opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-full opacity-0"
		>
			<div
				v-if="showVariants"
				class="fixed right-4 bottom-36 z-50 w-72 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Component Variants</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
						@click="showVariants = false"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="p-4 space-y-3">
					<button
						class="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
						@click="addVariant"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
						<span>Add New Variant</span>
					</button>

					<div class="space-y-2">
						<div
							v-for="variant in variants"
							:key="variant.id"
							class="group flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all"
							:class="{ 'ring-1 ring-indigo-500': selectedVariant === variant.id }"
							@click="selectedVariant = variant.id"
						>
							<div class="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
								<svg
									v-if="variant.icon === 'square'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
								</svg>
								<svg
									v-else-if="variant.icon === 'mouse-pointer'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400"
								>
									<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
								</svg>
								<svg
									v-else-if="variant.icon === 'zap'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400"
								>
									<polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
								</svg>
								<svg
									v-else-if="variant.icon === 'ban'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
								</svg>
								<svg
									v-else-if="variant.icon === 'loader'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400 animate-spin"
								>
									<path d="M21 12a9 9 0 1 1-6.219-8.56" />
								</svg>
								<svg
									v-else-if="variant.icon === 'alert-circle'"
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="text-gray-400"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="12" y1="8" x2="12" y2="12" />
									<line x1="12" y1="16" x2="12.01" y2="16" />
								</svg>
							</div>
							<div class="flex-1">
								<div class="text-white text-sm font-medium">
									{{ variant.name }}
								</div>
								<div class="text-gray-500 text-xs">State variant</div>
							</div>
							<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									class="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white"
									@click.stop="duplicateVariant(variant.id)"
									title="Duplicate"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
								</button>
								<button
									class="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-red-400"
									@click.stop="deleteVariant(variant.id)"
									title="Delete"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
