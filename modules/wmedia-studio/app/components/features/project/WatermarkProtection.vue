<script setup lang="ts">
interface WatermarkPreset {
	id: string;
	name: string;
	type: "logo" | "text" | "pattern";
	preview: string;
}

interface ProtectionSetting {
	id: string;
	name: string;
	enabled: boolean;
	level: "low" | "medium" | "high";
}

const selectedPreset = ref<string>("logo");
const watermarkText = ref("MEDIA STUDIO");
const watermarkLogo = ref<string | null>(null);
const opacity = ref(50);
const position = ref<
	"top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
>("bottom-right");
const size = ref(20);
const dynamicWatermark = ref(true);
const drmEnabled = ref(false);
const fingerprintEnabled = ref(true);

const presets: WatermarkPreset[] = [
	{
		id: "logo",
		name: "Logo Watermark",
		type: "logo",
		preview: "/watermarks/logo.png",
	},
	{
		id: "text",
		name: "Text Watermark",
		type: "text",
		preview: "/watermarks/text.png",
	},
	{
		id: "pattern",
		name: "Pattern Overlay",
		type: "pattern",
		preview: "/watermarks/pattern.png",
	},
];

const protectionSettings = ref<ProtectionSetting[]>([
	{
		id: "1",
		name: "Screen Recording Protection",
		enabled: true,
		level: "high",
	},
	{ id: "2", name: "Screenshot Prevention", enabled: true, level: "medium" },
	{ id: "3", name: "Invisible Fingerprinting", enabled: true, level: "high" },
	{ id: "4", name: "Right-Click Disable", enabled: false, level: "low" },
	{ id: "5", name: "Download Prevention", enabled: true, level: "medium" },
]);

function applyWatermark() {
	alert("Watermark applied to content!");
}

function downloadProtectedContent() {
	alert("Exporting DRM-protected content...");
}
</script>

<template>
	<div class="watermark-protection">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:shield-check" class="mr-2" />
			Watermark & Brand Protection
		</h2>
		<p class="text-gray-500 mb-6">Dynamic watermarks with DRM options</p>

		<div class="grid grid-cols-2 gap-6">
			<!-- Watermark Settings -->
			<div class="space-y-4">
				<!-- Preset Selection -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Watermark Type</h3>
					<div class="grid grid-cols-3 gap-3">
						<button
							v-for="preset in presets"
							:key="preset.id"
							class="p-3 border rounded-lg text-center"
							:class="selectedPreset === preset.id
							? 'ring-2 ring-blue-500 bg-blue-50'
							: 'hover:bg-gray-50'"
							@click="selectedPreset = preset.id"
						>
							<Icon
								:name="preset.type === 'logo'
								? 'mdi:image'
								: preset.type === 'text'
								? 'mdi:text'
								: 'mdi:pattern'"
								class="text-2xl mb-2"
							/>
							<p class="text-sm font-medium">{{ preset.name }}</p>
						</button>
					</div>
				</div>

				<!-- Text/Logo Settings -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Watermark Content</h3>

					<div v-if="selectedPreset === 'text'" class="space-y-3">
						<div>
							<label class="block text-sm mb-1">Watermark Text</label>
							<input
								v-model="watermarkText"
								type="text"
								class="w-full border rounded px-3 py-2"
							/>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="block text-sm mb-1"
								>Font Size: {{ size }}px</label>
								<input
									v-model="size"
									type="range"
									min="10"
									max="100"
									class="w-full"
								/>
							</div>
							<div>
								<label class="block text-sm mb-1"
								>Opacity: {{ opacity }}%</label>
								<input
									v-model="opacity"
									type="range"
									min="10"
									max="100"
									class="w-full"
								/>
							</div>
						</div>
					</div>

					<div v-else-if="selectedPreset === 'logo'" class="space-y-3">
						<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
							<input type="file" accept="image/*" class="hidden" />
							<label class="cursor-pointer">
								<Icon name="mdi:upload" class="text-3xl text-gray-400 mb-2" />
								<p class="text-sm">Upload logo (PNG with transparency)</p>
							</label>
						</div>
						<div>
							<label class="block text-sm mb-1">Size: {{ size }}%</label>
							<input
								v-model="size"
								type="range"
								min="5"
								max="50"
								class="w-full"
							/>
						</div>
					</div>
				</div>

				<!-- Position & Style -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Position</h3>
					<div class="grid grid-cols-3 gap-2">
						<button
							v-for='pos in [
								"top-left",
								"top-right",
								"center",
								"bottom-left",
								"bottom-right",
							] as const'
							:key="pos"
							class="p-2 border rounded text-sm capitalize"
							:class="position === pos ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'"
							@click="position = pos"
						>
							{{ pos.replace("-", " ") }}
						</button>
					</div>
				</div>

				<!-- Dynamic Watermark -->
				<div class="bg-gray-50 rounded-lg p-4">
					<label class="flex items-center gap-3">
						<input v-model="dynamicWatermark" type="checkbox" class="rounded" />
						<div>
							<span class="font-medium">Dynamic Watermark</span>
							<p class="text-sm text-gray-500">
								Embed user ID, timestamp, IP address invisibly
							</p>
						</div>
					</label>
				</div>
			</div>

			<!-- Protection Settings -->
			<div class="space-y-4">
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold">DRM Protection</h3>
						<label class="relative inline-flex items-center cursor-pointer">
							<input
								v-model="drmEnabled"
								type="checkbox"
								class="sr-only peer"
							/>
							<div class="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
							</div>
						</label>
					</div>

					<div v-if="drmEnabled" class="space-y-3">
						<div
							v-for="setting in protectionSettings"
							:key="setting.id"
							class="flex items-center justify-between p-3 bg-white rounded-lg"
						>
							<div>
								<p class="font-medium">{{ setting.name }}</p>
								<p class="text-xs text-gray-500">
									Protection level: {{ setting.level }}
								</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input
									v-model="setting.enabled"
									type="checkbox"
									class="sr-only peer"
								/>
								<div class="w-9 h-5 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600">
								</div>
							</label>
						</div>
					</div>
				</div>

				<!-- Fingerprinting -->
				<div class="bg-gray-50 rounded-lg p-4">
					<h3 class="font-semibold mb-3">Invisible Fingerprinting</h3>
					<label class="flex items-start gap-3">
						<input
							v-model="fingerprintEnabled"
							type="checkbox"
							class="rounded mt-1"
						/>
						<div>
							<span class="font-medium">Enable Forensic Watermarking</span>
							<p class="text-sm text-gray-500">
								Embed invisible data to identify leak sources
							</p>
						</div>
					</label>

					<div v-if="fingerprintEnabled" class="mt-4 space-y-2 text-sm">
						<div class="flex items-center gap-2">
							<Icon name="mdi:account" class="text-green-500" />
							<span>User ID encoding</span>
						</div>
						<div class="flex items-center gap-2">
							<Icon name="mdi:clock" class="text-green-500" />
							<span>Timestamp embedding</span>
						</div>
						<div class="flex items-center gap-2">
							<Icon name="mdi:ip-network" class="text-green-500" />
							<span>IP address tracking</span>
						</div>
						<div class="flex items-center gap-2">
							<Icon name="mdi:device" class="text-green-500" />
							<span>Device fingerprinting</span>
						</div>
					</div>
				</div>

				<!-- Preview -->
				<div class="bg-gray-900 rounded-lg p-4">
					<h3 class="font-semibold text-white mb-3">Preview</h3>
					<div class="aspect-video bg-gray-700 rounded relative overflow-hidden">
						<div class="absolute inset-0 flex items-center justify-center">
							<Icon name="mdi:video" class="text-4xl text-gray-500" />
						</div>
						<!-- Watermark Preview -->
						<div
							class="absolute text-white font-bold pointer-events-none"
							:style="{
								opacity: opacity / 100,
								fontSize: `${size}px`,
								...(position === 'top-left'
									? { top: '20px', left: '20px' }
									: {}),
								...(position === 'top-right'
									? { top: '20px', right: '20px' }
									: {}),
								...(position === 'bottom-left'
									? { bottom: '20px', left: '20px' }
									: {}),
								...(position === 'bottom-right'
									? { bottom: '20px', right: '20px' }
									: {}),
								...(position === 'center'
									? {
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
									}
									: {}),
							}"
						>
							{{ watermarkText }}
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex gap-3">
					<button
						@click="applyWatermark"
						class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
					>
						<Icon name="mdi:water-check" class="mr-1" />
						Apply Watermark
					</button>
					<button
						@click="downloadProtectedContent"
						class="flex-1 border py-2 rounded-lg hover:bg-gray-50"
					>
						<Icon name="mdi:download-lock" class="mr-1" />
						Export Protected
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.watermark-protection {
	padding: 1.5rem;
}
</style>
