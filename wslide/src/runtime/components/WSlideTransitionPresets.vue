<script setup lang="ts">
const props = defineProps<{
	animations?: string[];
	currentAnimation?: string;
}>();

const emit = defineEmits<{
	select: [animation: string];
}>();

const isOpen = ref(false);

const presetAnimations = [
	{ name: "slide", label: "Slide", icon: "→" },
	{ name: "fade", label: "Fade", icon: "◯" },
	{ name: "zoom", label: "Zoom", icon: "⬤" },
	{ name: "flip", label: "Flip", icon: "⟲" },
	{ name: "cube", label: "Cube", icon: "⧉" },
	{ name: "parallax", label: "Parallax", icon: "↔" },
	{ name: "dissolve", label: "Dissolve", icon: "◐" },
	{ name: "wipe", label: "Wipe", icon: "▮" },
];

function selectAnimation(animation: string) {
	emit("select", animation);
	isOpen.value = false;
}
</script>

<template>
	<div class="relative">
		<button
			class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
			@click="isOpen = !isOpen"
		>
			<span>Transition: {{ currentAnimation || "slide" }}</span>
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>

		<div
			v-if="isOpen"
			class="absolute bottom-full mb-2 right-0 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-2 min-w-[160px] z-50"
		>
			<div class="text-xs text-gray-400 uppercase tracking-wider px-2 py-1">Presets</div>
			<button
				v-for="preset in presetAnimations"
				:key="preset.name"
				class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
				:class="currentAnimation === preset.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'"
				@click="selectAnimation(preset.name)"
			>
				<span class="text-lg">{{ preset.icon }}</span>
				<span>{{ preset.label }}</span>
			</button>
		</div>
	</div>
</template>
