<script setup lang="ts">
const emit = defineEmits<{ close: []; apply: [settings: any] }>();
const text = ref("Your Watermark");
const position = ref("bottom-right");
const opacity = ref(50);
const size = ref(20);
const animation = ref("none");

const positions = [
	"top-left",
	"top-right",
	"bottom-left",
	"bottom-right",
	"center",
];
const animations = ["none", "fade", "pulse", "bounce"];

const apply = () =>
	emit("apply", {
		text: text.value,
		position: position.value,
		opacity: opacity.value,
		size: size.value,
	});
</script>

<template>
	<div class="video-watermark bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:copyright" class="w-5 h-5 text-blue-500" />
				Video Watermark
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
				Video Preview
			</div>
			<div
				class="absolute px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded text-sm font-medium transition-all shadow-sm"
				:class="`watermark-${position}`"
				:style="{ opacity: opacity / 100, fontSize: `${size}px` }"
			>
				{{ text }}
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Watermark Text</label>
			<input
				v-model="text"
				type="text"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			/>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Position</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="p in positions"
					:key="p"
					class="p-2 rounded-lg text-center text-xs capitalize transition-all"
					:class="position === p
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
					@click="position = p"
				>
					{{ p.replace("-", " ") }}
				</button>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Opacity</span>
					<span class="text-blue-500 font-medium">{{ opacity }}%</span>
				</div>
				<input
					v-model="opacity"
					type="range"
					min="10"
					max="100"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
			</div>
			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600 dark:text-gray-400">Size</span>
					<span class="text-blue-500 font-medium">{{ size }}px</span>
				</div>
				<input
					v-model="size"
					type="range"
					min="12"
					max="48"
					class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Animation</label>
			<select
				v-model="animation"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="a in animations" :key="a" :value="a">{{ a }}</option>
			</select>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="apply"
		>
			Apply Watermark
		</button>
	</div>
</template>

<style scoped>
.watermark-top-left {
	top: 16px;
	left: 16px;
}
.watermark-top-right {
	top: 16px;
	right: 16px;
}
.watermark-bottom-left {
	bottom: 16px;
	left: 16px;
}
.watermark-bottom-right {
	bottom: 16px;
	right: 16px;
}
.watermark-center {
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
