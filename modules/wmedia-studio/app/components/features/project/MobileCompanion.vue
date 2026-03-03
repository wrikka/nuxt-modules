<script setup lang="ts">
interface DeviceStatus {
	id: string;
	name: string;
	type: "ios" | "android";
	status: "connected" | "disconnected" | "syncing";
	battery: number;
	lastSync: Date;
}

const devices = ref<DeviceStatus[]>([
	{
		id: "1",
		name: "iPhone 15 Pro",
		type: "ios",
		status: "connected",
		battery: 78,
		lastSync: new Date(),
	},
	{
		id: "2",
		name: "Pixel 8",
		type: "android",
		status: "disconnected",
		battery: 45,
		lastSync: new Date("2024-01-15"),
	},
]);
const qrCode = ref("");
const showQR = ref(false);

const features = [
	{
		icon: "mdi:remote",
		name: "Remote Control",
		desc: "Control desktop editor",
	},
	{
		icon: "mdi:upload",
		name: "Quick Upload",
		desc: "Upload from mobile to project",
	},
	{ icon: "mdi:comment", name: "Review & Comment", desc: "Review on the go" },
	{ icon: "mdi:share", name: "Quick Share", desc: "Share to social media" },
];

function generateQR() {
	showQR.value = true;
	qrCode.value = "MOBILE_CONNECT_" + Date.now();
}
</script>

<template>
	<div class="mobile-companion">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:cellphone-link" class="mr-2" />Mobile Companion App
		</h2>
		<p class="text-gray-500 mb-6">iOS/Android app for uploading/reviewing</p>

		<div class="grid grid-cols-2 gap-6">
			<!-- Connected Devices -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold">Connected Devices</h3>
						<button
							@click="generateQR"
							class="px-3 py-1 bg-blue-600 text-white rounded text-sm"
						>
							<Icon name="mdi:qrcode" class="mr-1" />Pair New
						</button>
					</div>
					<div class="space-y-2">
						<div
							v-for="device in devices"
							:key="device.id"
							class="flex items-center gap-3 p-3 bg-white rounded-lg"
						>
							<Icon
								:name="device.type === 'ios' ? 'mdi:apple' : 'mdi:android'"
								class="text-2xl"
								:class="device.type === 'ios' ? 'text-gray-800' : 'text-green-600'"
							/>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="font-medium">{{ device.name }}</span>
									<span
										class="text-xs px-2 py-0.5 rounded"
										:class="device.status === 'connected'
										? 'bg-green-100 text-green-700'
										: 'bg-gray-100 text-gray-600'"
									>{{ device.status }}</span>
								</div>
								<div class="text-xs text-gray-500">
									{{ device.battery }}% battery • Last sync: {{
										device.lastSync.toLocaleDateString()
									}}
								</div>
							</div>
							<button class="text-gray-400 hover:text-red-500">
								<Icon name="mdi:close" />
							</button>
						</div>
					</div>
				</div>

				<!-- QR Code Modal -->
				<div v-if="showQR" class="bg-blue-50 rounded-lg p-6 text-center">
					<h4 class="font-semibold mb-2">Scan to Connect</h4>
					<div class="w-48 h-48 bg-white mx-auto mb-4 flex items-center justify-center rounded">
						<Icon name="mdi:qrcode" class="text-8xl" />
					</div>
					<p class="text-sm text-gray-500 mb-2">
						Scan with Media Studio mobile app
					</p>
					<button @click="showQR = false" class="text-blue-600 text-sm">
						Close
					</button>
				</div>
			</div>

			<!-- Features -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-4">Mobile Features</h3>
					<div class="grid grid-cols-2 gap-3">
						<div
							v-for="f in features"
							:key="f.name"
							class="p-3 bg-white rounded-lg text-center"
						>
							<Icon :name="f.icon" class="text-3xl text-blue-600 mb-2" />
							<div class="font-medium text-sm">{{ f.name }}</div>
							<div class="text-xs text-gray-500">{{ f.desc }}</div>
						</div>
					</div>
				</div>

				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Recent Mobile Uploads</h3>
					<div class="space-y-2 text-sm">
						<div class="flex items-center gap-3 p-2 bg-white rounded">
							<Icon name="mdi:video" class="text-purple-500" />
							<div class="flex-1">
								<div class="font-medium">B-Roll Footage</div>
								<div class="text-xs text-gray-500">
									From iPhone 15 Pro • 2 min ago
								</div>
							</div>
						</div>
						<div class="flex items-center gap-3 p-2 bg-white rounded">
							<Icon name="mdi:image" class="text-blue-500" />
							<div class="flex-1">
								<div class="font-medium">Location Photo</div>
								<div class="text-xs text-gray-500">
									From Pixel 8 • 1 hour ago
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.mobile-companion {
	padding: 1.5rem;
}
</style>
