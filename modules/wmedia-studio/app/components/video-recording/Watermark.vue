<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		modelValue: string;
	}>(),
	{
		modelValue: "",
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: string];
}>();

const watermarkTypes = [
	{ id: "none", name: "None", icon: "mdi:close" },
	{ id: "text", name: "Text", icon: "mdi:format-text" },
	{ id: "image", name: "Logo", icon: "mdi:image" },
];

const positions = [
	{ id: "top-left", name: "Top Left", icon: "mdi:align-vertical-top" },
	{ id: "top-right", name: "Top Right", icon: "mdi:align-vertical-top" },
	{ id: "bottom-left", name: "Bottom Left", icon: "mdi:align-vertical-bottom" },
	{
		id: "bottom-right",
		name: "Bottom Right",
		icon: "mdi:align-vertical-bottom",
	},
	{ id: "center", name: "Center", icon: "mdi:align-horizontal-center" },
];

const watermarkType = ref("none");
const watermarkText = ref("© Media Studio");
const watermarkImage = ref("");
const watermarkPosition = ref("bottom-right");
const watermarkSize = ref(20);
const watermarkOpacity = ref(0.5);
const watermarkColor = ref("#ffffff");
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
			Watermark / Logo
		</h3>

		<div class="space-y-3">
			<!-- Type -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="type in watermarkTypes"
					:key="type.id"
					:class="[
						'p-2 rounded-lg border text-center transition-all',
						watermarkType === type.id
							? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
					]"
					@click="watermarkType = type.id"
				>
					<Icon
						:name="type.icon"
						class="w-5 h-5 mx-auto mb-1"
						:class="watermarkType === type.id ? 'text-purple-500' : 'text-gray-400'"
					/>
					<p class="text-xs">{{ type.name }}</p>
				</button>
			</div>

			<div v-if="watermarkType !== 'none'" class="space-y-3">
				<!-- Text Watermark -->
				<div v-if="watermarkType === 'text'">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Watermark Text</label>
					<input
						v-model="watermarkText"
						type="text"
						class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
						placeholder="Enter watermark text..."
					/>
					<div class="flex items-center gap-2 mt-2">
						<input
							v-model="watermarkColor"
							type="color"
							class="w-8 h-8 rounded"
						/>
						<input
							v-model="watermarkColor"
							type="text"
							class="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
						/>
					</div>
				</div>

				<!-- Image Watermark -->
				<div v-if="watermarkType === 'image'">
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Logo URL</label>
					<input
						v-model="watermarkImage"
						type="text"
						class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
						placeholder="https://example.com/logo.png"
					/>
				</div>

				<!-- Position -->
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400 mb-2 block"
					>Position</label>
					<div class="grid grid-cols-5 gap-1">
						<button
							v-for="pos in positions"
							:key="pos.id"
							:class="[
								'p-2 rounded text-center transition-all',
								watermarkPosition === pos.id
									? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200',
							]"
							@click="watermarkPosition = pos.id"
						>
							<Icon :name="pos.icon" class="w-4 h-4 mx-auto" />
							<p class="text-[10px] mt-1">{{ pos.name }}</p>
						</button>
					</div>
				</div>

				<!-- Size & Opacity -->
				<div class="space-y-2">
					<div>
						<label class="text-xs text-gray-600 dark:text-gray-400"
						>Size: {{ watermarkSize }}%</label>
						<input
							v-model.number="watermarkSize"
							type="range"
							min="5"
							max="50"
							class="w-full"
						/>
					</div>
					<div>
						<label class="text-xs text-gray-600 dark:text-gray-400"
						>Opacity: {{ Math.round(watermarkOpacity * 100) }}%</label>
						<input
							v-model.number="watermarkOpacity"
							type="range"
							min="0.1"
							max="1"
							step="0.1"
							class="w-full"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
