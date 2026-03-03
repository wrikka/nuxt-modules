<script setup lang="ts">
import { computed } from "vue";

interface Props {
	progress: number;
}

const props = defineProps<Props>();

const progressStyle = computed(() => ({
	width: `${props.progress}%`,
}));
</script>

<template>
	<div class="fixed bottom-0 left-0 right-0 h-1 bg-white/10 z-100">
		<div
			class="h-full bg-gradient-to-r from-wslide-primary to-wslide-secondary transition-all duration-300 ease-out"
			:style="progressStyle"
		/>
	</div>
</template>

<style scoped>
/* No additional styles needed - using UnoCSS */
</style>
