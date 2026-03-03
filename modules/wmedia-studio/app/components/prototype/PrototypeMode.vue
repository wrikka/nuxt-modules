<script setup lang="ts">
interface Hotspot {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	action: string;
	target: string;
}

interface PrototypeScreen {
	id: string;
	name: string;
	hotspots: Hotspot[];
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	preview: [screenId: string];
}>();

const isPreviewMode = ref(false);
const currentScreen = ref<string>("screen1");

const screens = ref<PrototypeScreen[]>([
	{
		id: "screen1",
		name: "Home Page",
		hotspots: [{
			id: "h1",
			x: 100,
			y: 200,
			width: 120,
			height: 40,
			action: "navigate",
			target: "screen2",
		}],
	},
	{
		id: "screen2",
		name: "Product Detail",
		hotspots: [{
			id: "h2",
			x: 50,
			y: 300,
			width: 80,
			height: 40,
			action: "navigate",
			target: "screen3",
		}],
	},
	{ id: "screen3", name: "Checkout", hotspots: [] },
]);

const addHotspot = () => {
	const screen = screens.value.find(s => s.id === currentScreen.value);
	if (screen) {
		screen.hotspots.push({
			id: `h-${Date.now()}`,
			x: 100,
			y: 100,
			width: 100,
			height: 50,
			action: "navigate",
			target: "",
		});
	}
};

const deleteHotspot = (screenId: string, hotspotId: string) => {
	const screen = screens.value.find(s => s.id === screenId);
	if (screen) {
		screen.hotspots = screen.hotspots.filter(h => h.id !== hotspotId);
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
		@click.self="emit('close')"
	>
		<div class="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<Icon name="mdi:cursor-pointer" class="w-6 h-6 text-orange-500" />
					<h2 class="text-lg font-bold text-gray-900 dark:text-white">
						Prototype Mode
					</h2>
				</div>
				<div class="flex items-center gap-2">
					<button
						:class="[
							'px-3 py-1.5 rounded-lg text-sm transition-colors',
							!isPreviewMode
								? 'bg-blue-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600',
						]"
						@click="isPreviewMode = false"
					>
						Edit
					</button>
					<button
						:class="[
							'px-3 py-1.5 rounded-lg text-sm transition-colors',
							isPreviewMode
								? 'bg-green-500 text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-600',
						]"
						@click="isPreviewMode = true"
					>
						Preview
					</button>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
						@click="emit('close')"
					>
						<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
					</button>
				</div>
			</div>

			<div class="flex-1 flex overflow-hidden">
				<!-- Sidebar - Screens -->
				<div class="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
						Screens
					</h3>
					<div class="space-y-2">
						<button
							v-for="screen in screens"
							:key="screen.id"
							:class="[
								'w-full text-left p-3 rounded-lg text-sm transition-colors',
								currentScreen === screen.id
									? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
									: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
							]"
							@click="currentScreen = screen.id"
						>
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-900 dark:text-white">{{
									screen.name
								}}</span>
								<span class="text-xs text-gray-500">{{ screen.hotspots.length }}
									hotspots</span>
							</div>
						</button>
					</div>

					<button
						v-if="!isPreviewMode"
						class="w-full mt-4 flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
						@click="screens.push({
							id: `screen-${Date.now()}`,
							name: `Screen ${screens.length + 1}`,
							hotspots: [],
						})"
					>
						<Icon name="mdi:plus" class="w-4 h-4" />
						Add Screen
					</button>
				</div>

				<!-- Main - Canvas -->
				<div class="flex-1 bg-gray-100 dark:bg-gray-800 p-8 overflow-auto">
					<div class="bg-white dark:bg-gray-900 w-full max-w-md mx-auto aspect-[4/3] rounded-lg shadow-lg relative">
						<!-- Screen Placeholder -->
						<div class="absolute inset-0 flex items-center justify-center">
							<p class="text-gray-400">
								{{ screens.find(s => s.id === currentScreen)?.name }}
							</p>
						</div>

						<!-- Hotspots -->
						<template v-if="!isPreviewMode">
							<div
								v-for="hotspot in screens.find(s => s.id === currentScreen)?.hotspots"
								:key="hotspot.id"
								class="absolute border-2 border-blue-500 bg-blue-500/20 rounded group"
								:style="{
									left: `${hotspot.x}px`,
									top: `${hotspot.y}px`,
									width: `${hotspot.width}px`,
									height: `${hotspot.height}px`,
								}"
							>
								<button
									class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
									@click="deleteHotspot(currentScreen, hotspot.id)"
								>
									<Icon name="mdi:close" class="w-3 h-3" />
								</button>
								<div class="absolute -bottom-6 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
									→ {{ hotspot.target }}
								</div>
							</div>
						</template>
					</div>
				</div>

				<!-- Sidebar - Hotspots -->
				<div
					v-if="!isPreviewMode"
					class="w-72 border-l border-gray-200 dark:border-gray-700 p-4"
				>
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
							Hotspots
						</h3>
						<button
							class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
							@click="addHotspot"
						>
							<Icon name="mdi:plus" class="w-4 h-4" />
						</button>
					</div>

					<div class="space-y-3">
						<div
							v-for="hotspot in screens.find(s => s.id === currentScreen)?.hotspots"
							:key="hotspot.id"
							class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
						>
							<div class="grid grid-cols-2 gap-2 mb-2">
								<input
									v-model.number="hotspot.x"
									type="number"
									placeholder="X"
									class="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
								>
								<input
									v-model.number="hotspot.y"
									type="number"
									placeholder="Y"
									class="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
								>
							</div>
							<select
								v-model="hotspot.target"
								class="w-full px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-xs"
							>
								<option value="">Select target...</option>
								<option
									v-for="screen in screens"
									:key="screen.id"
									:value="screen.id"
								>
									{{ screen.name }}
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
