<script setup lang="ts">
interface Device {
	id: string;
	name: string;
	width: number;
	height: number;
	icon: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	selectDevice: [device: Device];
}>();

const devices: Device[] = [
	{
		id: "mobile",
		name: "Mobile",
		width: 375,
		height: 667,
		icon: "mdi:cellphone",
	},
	{
		id: "tablet",
		name: "Tablet",
		width: 768,
		height: 1024,
		icon: "mdi:tablet",
	},
	{
		id: "desktop",
		name: "Desktop",
		width: 1440,
		height: 900,
		icon: "mdi:monitor",
	},
	{
		id: "laptop",
		name: "Laptop",
		width: 1366,
		height: 768,
		icon: "mdi:laptop",
	},
];

const selectedDevices = ref<string[]>(["desktop"]);
const zoom = ref(100);

const toggleDevice = (deviceId: string) => {
	if (selectedDevices.value.includes(deviceId)) {
		selectedDevices.value = selectedDevices.value.filter(id => id !== deviceId);
	} else {
		selectedDevices.value.push(deviceId);
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-x-0 bottom-0 h-96 bg-gray-900 border-t border-gray-800 shadow-2xl z-50 flex flex-col"
	>
		<!-- Toolbar -->
		<div class="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/50">
			<div class="flex items-center gap-4">
				<h3 class="font-semibold text-white flex items-center gap-2">
					<Icon name="mdi:devices" class="w-5 h-5 text-blue-400" />
					Device Preview
				</h3>

				<div class="flex items-center gap-2">
					<button
						v-for="device in devices"
						:key="device.id"
						:class="[
							'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
							selectedDevices.includes(device.id)
								? 'bg-blue-500 text-white'
								: 'bg-gray-700 text-gray-400 hover:text-white',
						]"
						@click="toggleDevice(device.id)"
					>
						<Icon :name="device.icon" class="w-4 h-4" />
						{{ device.name }}
					</button>
				</div>
			</div>

			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-400">{{ zoom }}%</span>
					<input
						v-model="zoom"
						type="range"
						min="25"
						max="100"
						class="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
					>
				</div>
				<button
					class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5 text-gray-400" />
				</button>
			</div>
		</div>

		<!-- Preview Area -->
		<div class="flex-1 overflow-auto p-8">
			<div class="flex gap-8 items-start justify-center min-h-full">
				<div
					v-for="device in devices.filter(d => selectedDevices.includes(d.id))"
					:key="device.id"
					class="flex flex-col items-center"
				>
					<!-- Device Label -->
					<div class="mb-2 text-sm text-gray-400">
						{{ device.name }} - {{ device.width }}x{{ device.height }}
					</div>

					<!-- Device Frame -->
					<div
						class="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-gray-700"
						:style="{
							width: `${device.width * zoom / 100}px`,
							height: `${device.height * zoom / 100}px`,
						}"
					>
						<!-- Preview Content Placeholder -->
						<div class="w-full h-full bg-gray-100 flex items-center justify-center">
							<div class="text-center">
								<Icon
									:name="device.icon"
									class="w-12 h-12 text-gray-300 mx-auto mb-2"
								/>
								<p class="text-sm text-gray-400">Preview</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
