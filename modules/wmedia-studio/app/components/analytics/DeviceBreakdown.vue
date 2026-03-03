<script setup lang="ts">
interface DeviceData {
	type: "desktop" | "mobile" | "tablet";
	os: string;
	browser: string;
	percentage: number;
}

const props = defineProps<{
	devices: DeviceData[];
}>();

const deviceIcons: Record<string, string> = {
	desktop: "i-mdi-monitor",
	mobile: "i-mdi-cellphone",
	tablet: "i-mdi-tablet",
};

const osIcons: Record<string, string> = {
	Windows: "i-mdi-microsoft-windows",
	macOS: "i-mdi-apple",
	Linux: "i-mdi-linux",
	Android: "i-mdi-android",
	iOS: "i-mdi-apple-ios",
};
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
			<i class="i-mdi-devices text-purple-500" />
			Device & Browser Breakdown
		</h3>

		<div class="grid grid-cols-2 gap-4">
			<div
				v-for="device in devices"
				:key="`${device.type}-${device.os}-${device.browser}`"
				class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center gap-3 mb-3">
					<div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
						<i
							:class="deviceIcons[device.type] || 'i-mdi-device-unknown'"
							class="text-blue-600 dark:text-blue-400"
						/>
					</div>
					<div>
						<div class="font-medium text-gray-900 dark:text-white capitalize">
							{{ device.type }}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">
							{{ device.os }}
						</div>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<i
							:class="osIcons[device.os] || 'i-mdi-web'"
							class="text-gray-400 text-sm"
						/>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{
							device.browser
						}}</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
							<div
								class="h-full bg-purple-500 rounded-full"
								:style="{ width: `${device.percentage}%` }"
							/>
						</div>
						<span class="text-sm font-medium text-gray-900 dark:text-white">{{
								device.percentage
							}}%</span>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="devices.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400 col-span-2"
		>
			<i class="i-mdi-devices text-3xl mb-2" />
			<p>No device data available</p>
		</div>
	</div>
</template>
