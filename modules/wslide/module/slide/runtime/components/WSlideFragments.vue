<script setup lang="ts">
const props = defineProps<{
	fragments?: string[];
	activeIndex?: number;
}>();

const emit = defineEmits<{
	activate: [index: number];
}>();

const containerRef = ref<HTMLElement>();

// Auto-activate fragments sequentially
const activeFragment = ref(0);

function activateNext() {
	if (activeFragment.value < (props.fragments?.length || 0) - 1) {
		activeFragment.value++;
		emit("activate", activeFragment.value);
	}
}

function activatePrev() {
	if (activeFragment.value > 0) {
		activeFragment.value--;
		emit("activate", activeFragment.value);
	}
}

function activate(index: number) {
	activeFragment.value = index;
	emit("activate", index);
}

// Keyboard navigation for fragments
onMounted(() => {
	const handler = (e: KeyboardEvent) => {
		if (e.key === "ArrowDown" || e.key === " ") {
			e.preventDefault();
			activateNext();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			activatePrev();
		}
	};
	window.addEventListener("keydown", handler);
	return () => window.removeEventListener("keydown", handler);
});

const animations = [
	"fragment-fade",
	"fragment-slide-up",
	"fragment-slide-down",
	"fragment-zoom",
	"fragment-highlight",
];
</script>

<template>
	<div ref="containerRef" class="fragment-container">
		<div
			v-for="(fragment, index) in fragments"
			:key="index"
			class="fragment"
			:class="[
				animations[index % animations.length],
				{ 'is-active': index <= activeFragment },
			]"
			@click="activate(index)"
		>
			{{ fragment }}
		</div>
	</div>
</template>

<style scoped>
.fragment-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.fragment {
	opacity: 0;
	transform: translateY(20px);
	transition: all 0.3s ease;
	cursor: pointer;
}

.fragment.is-active {
	opacity: 1;
	transform: translateY(0);
}

.fragment-fade {
	opacity: 0;
}

.fragment-fade.is-active {
	opacity: 1;
}

.fragment-slide-up {
	transform: translateY(30px);
}

.fragment-slide-up.is-active {
	transform: translateY(0);
}

.fragment-slide-down {
	transform: translateY(-30px);
}

.fragment-slide-down.is-active {
	transform: translateY(0);
}

.fragment-zoom {
	transform: scale(0.8);
}

.fragment-zoom.is-active {
	transform: scale(1);
}

.fragment-highlight {
	background: transparent;
}

.fragment-highlight.is-active {
	background: rgba(59, 130, 246, 0.2);
}
</style>
