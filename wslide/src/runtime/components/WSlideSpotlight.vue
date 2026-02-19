<script setup lang="ts">
import { useSpotlight } from "../../composables/useSpotlight";

const spotlight = useSpotlight();
</script>

<template>
	<div
		v-if="spotlight.isActive.value"
		class="fixed inset-0 z-50 pointer-events-none"
		@mousemove="spotlight.handleMouseMove"
	>
		<div
			class="absolute rounded-full bg-transparent"
			:style="{
				left: `${spotlight.position.value.x - spotlight.size.value / 2}px`,
				top: `${spotlight.position.value.y - spotlight.size.value / 2}px`,
				width: `${spotlight.size.value}px`,
				height: `${spotlight.size.value}px`,
				boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.85), inset 0 0 30px rgba(255, 255, 255, 0.2)`,
			}"
		/>
	</div>
</template>
