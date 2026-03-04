<script setup lang="ts">
const isConnected = ref(false);
const isConnecting = ref(false);
const qrCode = ref("");
const connectionCode = ref("");
const deviceName = ref("");
const batteryLevel = ref(100);

const emit = defineEmits<{
	connect: [stream: MediaStream];
	disconnect: [];
}>();

const generateCode = () => {
	connectionCode.value = Math.random().toString(36).substring(2, 8)
		.toUpperCase();
	qrCode.value = `https://mediastudio.app/mobile?code=${connectionCode.value}`;
};

const startConnecting = () => {
	isConnecting.value = true;
	generateCode();

	// Simulate connection after 3 seconds
	setTimeout(() => {
		isConnected.value = true;
		isConnecting.value = false;
		deviceName.value = "iPhone 15 Pro";
	}, 3000);
};

const disconnect = () => {
	isConnected.value = false;
	isConnecting.value = false;
	deviceName.value = "";
	emit("disconnect");
};

const connectionSteps = [
	"Open Media Studio app on your phone",
	"Tap 'Connect as Webcam'",
	"Enter the code or scan QR code",
	"Grant camera permissions",
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Mobile Camera
			</h3>
			<div
				class="px-2 py-1 rounded-full text-xs font-medium"
				:class="isConnected
				? 'bg-green-100 text-green-700'
				: 'bg-gray-100 text-gray-600'"
			>
				{{ isConnected ? "Connected" : "Not connected" }}
			</div>
		</div>

		<div v-if="!isConnected && !isConnecting" class="space-y-4">
			<div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
					<Icon name="mdi:cellphone-wireless" class="w-6 h-6 text-purple-600" />
				</div>
				<div>
					<p class="font-medium text-gray-900 dark:text-white">
						Use your phone as a webcam
					</p>
					<p class="text-sm text-gray-500">
						High quality, wireless camera feed
					</p>
				</div>
			</div>

			<button
				class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
				@click="startConnecting"
			>
				<Icon name="mdi:qrcode-scan" class="w-5 h-5 inline mr-2" />
				Connect Mobile Camera
			</button>
		</div>

		<div v-else-if="isConnecting" class="space-y-4">
			<div class="text-center">
				<div class="w-32 h-32 mx-auto bg-white p-2 rounded-lg">
					<!-- QR Code placeholder -->
					<div class="w-full h-full bg-gray-900 flex items-center justify-center">
						<Icon name="mdi:qrcode" class="w-20 h-20 text-white" />
					</div>
				</div>
				<p class="text-lg font-mono font-bold text-gray-900 dark:text-white mt-2">
					{{ connectionCode }}
				</p>
				<p class="text-sm text-gray-500">Enter this code on your phone</p>
			</div>

			<div class="space-y-2">
				<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Steps:
				</p>
				<div
					v-for="(step, i) in connectionSteps"
					:key="i"
					class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
				>
					<span
						class="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center text-xs"
					>{{ i + 1 }}</span>
					{{ step }}
				</div>
			</div>

			<div class="flex items-center justify-center gap-2 text-sm text-purple-600">
				<Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
				Waiting for connection...
			</div>

			<button
				class="w-full py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900"
				@click="isConnecting = false"
			>
				Cancel
			</button>
		</div>

		<div v-else class="space-y-4">
			<div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<div class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
					<Icon name="mdi:check" class="w-5 h-5 text-green-600" />
				</div>
				<div class="flex-1">
					<p class="font-medium text-gray-900 dark:text-white">
						{{ deviceName }}
					</p>
					<div class="flex items-center gap-2 text-sm text-gray-500">
						<Icon name="mdi:battery" class="w-4 h-4" />
						<span>{{ batteryLevel }}%</span>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<button class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
					<Icon name="mdi:camera-flip" class="w-4 h-4 inline mr-1" />
					Flip Camera
				</button>
				<button class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
					<Icon name="mdi:flash" class="w-4 h-4 inline mr-1" />
					Flashlight
				</button>
			</div>

			<button
				class="w-full py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
				@click="disconnect"
			>
				<Icon name="mdi:close" class="w-4 h-4 inline mr-1" />
				Disconnect
			</button>
		</div>
	</div>
</template>
