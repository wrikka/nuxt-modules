<script setup lang="ts">
const showResponsive = ref(false);
const selectedDevice = ref("desktop");
const orientation = ref<"portrait" | "landscape">("portrait");
const zoom = ref(100);

const devices = [
	{
		id: "desktop",
		name: "Desktop",
		width: 1920,
		height: 1080,
		icon: "monitor",
	},
	{ id: "laptop", name: "Laptop", width: 1440, height: 900, icon: "laptop" },
	{ id: "tablet", name: "Tablet", width: 768, height: 1024, icon: "tablet" },
	{ id: "mobile", name: "Mobile", width: 375, height: 812, icon: "smartphone" },
	{ id: "watch", name: "Watch", width: 200, height: 200, icon: "watch" },
];

const toggleOrientation = () => {
	orientation.value = orientation.value === "portrait"
		? "landscape"
		: "portrait";
};
</script>

<template>
	<div>
		<button
			class="fixed right-40 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-110"
			:class="{ 'ring-2 ring-emerald-400 ring-offset-2': showResponsive }"
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
				<rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
				<line x1="12" y1="18" x2="12.01" y2="18" />
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
				class="fixed right-40 bottom-20 z-50 w-80 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl overflow-hidden"
			>
				<div class="flex items-center justify-between p-4 border-b border-gray-800">
					<h3 class="text-white font-semibold">Responsive Preview</h3>
					<button
						class="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
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
						>
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="p-4 space-y-4">
					<div class="grid grid-cols-5 gap-2">
						<button
							v-for="device in devices"
							:key="device.id"
							class="p-2 rounded-lg flex flex-col items-center gap-1 transition-all"
							:class="selectedDevice === device.id
							? 'bg-emerald-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
							@click="selectedDevice = device.id"
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
								<rect x="2" y="3" width="20" height="14" rx="2" />
								<line x1="8" y1="21" x2="16" y2="21" />
								<line x1="12" y1="17" x2="12" y2="21" />
							</svg>
							<span class="text-[10px]">{{ device.name }}</span>
						</button>
					</div>

					<div class="p-3 rounded-lg bg-gray-800">
						<div class="flex items-center justify-between mb-2">
							<span class="text-white text-sm font-medium">{{
								devices.find(d => d.id === selectedDevice)?.name
							}}</span>
							<button
								class="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
								@click="toggleOrientation"
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
									<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
								</svg>
							</button>
						</div>
						<div class="text-gray-400 text-xs">
							{{
								orientation === "portrait"
								? `${devices.find(d => d.id === selectedDevice)?.width} × ${
									devices.find(d => d.id === selectedDevice)?.height
								}`
								: `${devices.find(d => d.id === selectedDevice)?.height} × ${
									devices.find(d => d.id === selectedDevice)?.width
								}`
							}}
						</div>
					</div>

					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="text-gray-400 text-xs">Zoom</label>
							<span class="text-white text-xs">{{ zoom }}%</span>
						</div>
						<input
							v-model.number="zoom"
							type="range"
							min="25"
							max="200"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
						>
					</div>

					<div class="flex gap-2">
						<button
							v-for="z in [25, 50, 75, 100, 150, 200]"
							:key="z"
							class="flex-1 px-2 py-1 rounded text-xs transition-colors"
							:class="zoom === z
							? 'bg-emerald-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
							@click="zoom = z"
						>
							{{ z }}%
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
