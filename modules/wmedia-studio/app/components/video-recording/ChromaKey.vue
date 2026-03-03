<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const colorKey = defineModel<"green" | "blue" | "red">("colorKey", {
	default: "green",
});
const similarity = defineModel<number>("similarity", { default: 50 });
const smoothness = defineModel<number>("smoothness", { default: 20 });
const backgroundType = defineModel<"blur" | "image" | "color">(
	"backgroundType",
	{ default: "blur" },
);
const backgroundImage = defineModel<string>("backgroundImage", { default: "" });
const backgroundColor = defineModel<string>("backgroundColor", {
	default: "#000000",
});

interface ColorOption {
	id: "green" | "blue" | "red";
	name: string;
	color: string;
}

const colorOptions: Array<ColorOption> = [
	{ id: "green", name: "Green Screen", color: "#00ff00" },
	{ id: "blue", name: "Blue Screen", color: "#0000ff" },
	{ id: "red", name: "Red Screen", color: "#ff0000" },
];

interface BackgroundOption {
	id: "blur" | "image" | "color";
	name: string;
	icon: string;
}

const bgOptions: Array<BackgroundOption> = [
	{ id: "blur", name: "Blur", icon: "mdi:blur" },
	{ id: "image", name: "Image", icon: "mdi:image" },
	{ id: "color", name: "Color", icon: "mdi:palette" },
];

interface StyleOption {
	id: "ripple" | "circle" | "highlight";
	name: string;
	icon: string;
	desc: string;
}

const styles: Array<StyleOption> = [
	{
		id: "ripple",
		name: "Ripple",
		icon: "mdi:signal-distance-variant",
		desc: "Expanding circle effect",
	},
	{
		id: "circle",
		name: "Circle",
		icon: "mdi:checkbox-blank-circle-outline",
		desc: "Simple circle around cursor",
	},
	{
		id: "highlight",
		name: "Highlight",
		icon: "mdi:cursor-pointer",
		desc: "Cursor highlight effect",
	},
];

const sampleImages = [
	"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920",
	"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920",
	"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920",
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Chroma Key / Green Screen
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="enabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<!-- Color Key -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 mb-2 block"
				>Key Color</label>
				<div class="flex gap-2">
					<button
						v-for="color in colorOptions"
						:key="color.id"
						:class="[
							'flex-1 p-2 rounded-lg border-2 text-center transition-all',
							colorKey === color.id
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
						]"
						@click="colorKey = color.id"
					>
						<div
							class="w-6 h-6 rounded mx-auto mb-1"
							:style="{ backgroundColor: color.color }"
						/>
						<p class="text-xs">{{ color.name }}</p>
					</button>
				</div>
			</div>

			<!-- Threshold & Smoothness -->
			<div class="space-y-2">
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Sensitivity: {{ similarity }}%</label>
					<input
						v-model.number="similarity"
						type="range"
						min="10"
						max="100"
						class="w-full"
					/>
				</div>
				<div>
					<label class="text-xs text-gray-600 dark:text-gray-400"
					>Edge Smoothness: {{ smoothness }}%</label>
					<input
						v-model.number="smoothness"
						type="range"
						min="0"
						max="100"
						class="w-full"
					/>
				</div>
			</div>

			<!-- Background Type -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 mb-2 block"
				>Background</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="bg in bgOptions"
						:key="bg.id"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							backgroundType === bg.id
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
						]"
						@click="backgroundType = bg.id"
					>
						<Icon
							:name="bg.icon"
							class="w-5 h-5 mx-auto mb-1"
							:class="backgroundType === bg.id ? 'text-purple-500' : 'text-gray-400'"
						/>
						<p class="text-xs">{{ bg.name }}</p>
					</button>
				</div>
			</div>

			<!-- Background Options -->
			<div v-if="backgroundType === 'image'" class="space-y-2">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Sample Images</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="img in sampleImages"
						:key="img"
						class="relative aspect-video rounded-lg overflow-hidden"
						:class="backgroundImage === img ? 'ring-2 ring-purple-500' : ''"
						@click="backgroundImage = img"
					>
						<img :src="img" class="w-full h-full object-cover" />
					</button>
				</div>
				<input
					v-model="backgroundImage"
					type="text"
					placeholder="Or enter image URL..."
					class="w-full mt-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
				/>
			</div>

			<div v-if="backgroundType === 'color'" class="flex items-center gap-2">
				<input
					v-model="backgroundColor"
					type="color"
					class="w-10 h-10 rounded"
				/>
				<input
					v-model="backgroundColor"
					type="text"
					class="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
				/>
			</div>
		</div>
	</div>
</template>
