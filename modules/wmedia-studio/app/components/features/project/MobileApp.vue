<script setup lang="ts">
const appFeatures = [
	{ icon: "mdi:pencil", title: "Quick Edit", desc: "Basic edits on the go" },
	{ icon: "mdi:upload", title: "Upload", desc: "Upload from camera/gallery" },
	{
		icon: "mdi:check-circle",
		title: "Approvals",
		desc: "Review and approve designs",
	},
	{ icon: "mdi:bell", title: "Notifications", desc: "Project updates" },
];

const downloadLinks = [
	{ platform: "iOS", icon: "mdi:apple", status: "available" },
	{ platform: "Android", icon: "mdi:android", status: "available" },
	{ platform: "iPad", icon: "mdi:tablet-ipad", status: "coming" },
];

const qrCode = ref(
	"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=mediastudio.app/download",
);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Mobile App
			</h3>
			<span
				class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded"
			>v2.1.0</span>
		</div>

		<!-- Phone Preview -->
		<div class="flex justify-center mb-6">
			<div class="w-48 h-80 bg-gray-900 rounded-3xl p-3 shadow-2xl">
				<div class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
					<div class="h-8 bg-blue-500 flex items-center justify-center">
						<span class="text-white text-xs font-medium">Media Studio</span>
					</div>
					<div class="p-3 space-y-2">
						<div
							v-for="(feature, i) in appFeatures"
							:key="i"
							class="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg"
						>
							<Icon :name="feature.icon" class="w-4 h-4 text-blue-500" />
							<div class="text-xs">
								<div class="font-medium">{{ feature.title }}</div>
								<div class="text-gray-500">{{ feature.desc }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- QR Code -->
		<div class="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
			<img :src="qrCode" alt="QR" class="w-16 h-16 rounded" />
			<div>
				<p class="text-sm font-medium">Scan to Download</p>
				<p class="text-xs text-gray-500">Point your camera at the QR code</p>
			</div>
		</div>

		<!-- Download Buttons -->
		<div class="grid grid-cols-3 gap-2">
			<button
				v-for="link in downloadLinks"
				:key="link.platform"
				class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
			>
				<Icon :name="link.icon" class="w-6 h-6" />
				<span class="text-xs">{{ link.platform }}</span>
				<span
					v-if="link.status === 'coming'"
					class="text-[10px] text-orange-500"
				>Soon</span>
			</button>
		</div>
	</div>
</template>
