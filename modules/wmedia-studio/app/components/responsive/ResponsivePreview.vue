<script setup lang="ts">
const showResponsive = ref(false);

const breakpoints = [
	{ name: "Mobile", width: 375, height: 667, icon: "📱" },
	{ name: "Tablet", width: 768, height: 1024, icon: "📱" },
	{ name: "Desktop", width: 1440, height: 900, icon: "💻" },
	{ name: "Wide", width: 1920, height: 1080, icon: "🖥️" },
];

const selectedBreakpoint = ref(2);
const orientation = ref<"portrait" | "landscape">("landscape");
const zoom = ref(100);

const rotate = () => {
	orientation.value = orientation.value === "portrait"
		? "landscape"
		: "portrait";
};
</script>

<template>
	<div>
		<button
			class="fixed bottom-4 left-1/2 z-50 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-slate-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-slate-400 ring-offset-2': showResponsive }"
			@click="showResponsive = !showResponsive"
			title="Responsive Preview"
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
				<rect width="16" height="10" x="4" y="14" rx="2" />
				<rect width="10" height="10" x="4" y="2" rx="2" />
				<path d="M14 7h6" />
				<path d="M17 4v6" />
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
				v-if="showResponsive"
				class="fixed bottom-20 left-1/2 z-50 w-[480px] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
			>
				<div class="border-b border-gray-200 bg-slate-600 p-3 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-white">Responsive</h3>
						<button
							class="text-white/80 hover:text-white"
							@click="showResponsive = false"
						>
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
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-4">
					<!-- Breakpoints -->
					<div class="mb-4 grid grid-cols-4 gap-2">
						<button
							v-for="(bp, i) in breakpoints"
							:key="bp.name"
							class="rounded-lg border border-gray-200 py-3 text-center transition-colors dark:border-gray-700"
							:class="selectedBreakpoint === i
							? 'bg-slate-600 text-white'
							: 'hover:bg-gray-50 dark:hover:bg-gray-800'"
							@click="selectedBreakpoint = i"
						>
							<span class="text-lg">{{ bp.icon }}</span>
							<p class="mt-1 text-[10px]">{{ bp.name }}</p>
						</button>
					</div>

					<!-- Device Info -->
					<div class="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
						<div class="flex items-center gap-3">
							<button
								class="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700"
								@click="rotate"
							>
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
									:class="orientation === 'landscape' ? 'rotate-90' : ''"
								>
									<rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
									<path d="M12 18h.01" />
								</svg>
							</button>
							<div>
								<p class="text-sm font-medium">
									{{ breakpoints[selectedBreakpoint]!.name }}
								</p>
								<p class="text-xs text-gray-500">
									{{
										orientation === "portrait"
										? breakpoints[selectedBreakpoint]!.width
										: breakpoints[selectedBreakpoint]!.height
									}} ×
									{{
										orientation === "portrait"
										? breakpoints[selectedBreakpoint]!.height
										: breakpoints[selectedBreakpoint]!.width
									}}
								</p>
							</div>
						</div>
						<span
							class="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800"
						>{{ zoom }}%</span>
					</div>

					<input
						v-model.number="zoom"
						type="range"
						min="25"
						max="200"
						class="w-full"
					/>
				</div>
			</div>
		</Transition>
	</div>
</template>
