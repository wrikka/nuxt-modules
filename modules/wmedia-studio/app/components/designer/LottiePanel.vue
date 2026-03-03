<script setup lang="ts">
export interface LottieAnimation {
	id: string;
	name: string;
	url: string;
	loop: boolean;
	autoplay: boolean;
	speed: number;
}

const props = defineProps<{
	selectedAnimation: LottieAnimation | null;
	availableAnimations: LottieAnimation[];
}>();

const emit = defineEmits<{
	(e: "upload", file: File): void;
	(e: "select", animation: LottieAnimation): void;
	(e: "update:loop", value: boolean): void;
	(e: "update:autoplay", value: boolean): void;
	(e: "update:speed", value: number): void;
	(e: "play"): void;
	(e: "pause"): void;
	(e: "stop"): void;
}>();

const isPlaying = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileSelect = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		emit("upload", file);
	}
};

const openFilePicker = () => {
	fileInputRef.value?.click();
};

const togglePlay = () => {
	if (isPlaying.value) {
		emit("pause");
	} else {
		emit("play");
	}
	isPlaying.value = !isPlaying.value;
};

const sampleAnimations = [
	{ id: "sample-1", name: "Success Check", url: "/animations/success.json" },
	{ id: "sample-2", name: "Loading Spinner", url: "/animations/loading.json" },
	{ id: "sample-3", name: "Heart Beat", url: "/animations/heart.json" },
	{ id: "sample-4", name: "Notification Bell", url: "/animations/bell.json" },
];
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>Lottie Animation</label>

		<input
			ref="fileInputRef"
			type="file"
			accept=".json"
			class="hidden"
			@change="handleFileSelect"
		>

		<button
			type="button"
			class="w-full p-2 rounded border border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
			@click="openFilePicker"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
				/>
			</svg>
			Upload Lottie JSON
		</button>

		<div v-if="sampleAnimations.length > 0" class="space-y-1">
			<label class="text-xs text-gray-600 dark:text-gray-400"
			>Sample Animations</label>
			<div class="grid grid-cols-2 gap-1">
				<button
					v-for="anim in sampleAnimations"
					:key="anim.id"
					type="button"
					class="p-2 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 text-xs text-left transition-colors"
					:class="selectedAnimation?.id === anim.id
					? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
					: 'bg-white dark:bg-gray-800'"
					@click="$emit('select', anim as LottieAnimation)"
				>
					<div class="w-full h-8 rounded bg-gray-100 dark:bg-gray-700 mb-1 flex items-center justify-center">
						<svg
							class="w-5 h-5 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="truncate">{{ anim.name }}</div>
				</button>
			</div>
		</div>

		<div
			v-if="selectedAnimation"
			class="space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
		>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					@click="togglePlay"
				>
					<svg
						v-if="!isPlaying"
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<svg
						v-else
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
				<button
					type="button"
					class="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
					@click='$emit("stop");
					isPlaying = false;'
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
						/>
					</svg>
				</button>
			</div>

			<div class="space-y-1">
				<div class="flex items-center justify-between">
					<label class="text-xs text-gray-600 dark:text-gray-400">Speed:</label>
					<span class="text-xs text-gray-500">{{
							selectedAnimation.speed
						}}×</span>
				</div>
				<input
					type="range"
					min="0.1"
					max="3"
					step="0.1"
					:value="selectedAnimation.speed"
					class="w-full"
					@input="$emit(
						'update:speed',
						Number(($event.target as HTMLInputElement).value),
					)"
				>
			</div>

			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400">Loop</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="selectedAnimation.loop"
						class="sr-only peer"
						@change="$emit('update:loop', ($event.target as HTMLInputElement).checked)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400">Autoplay</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="selectedAnimation.autoplay"
						class="sr-only peer"
						@change="$emit(
							'update:autoplay',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>
		</div>
	</div>
</template>
