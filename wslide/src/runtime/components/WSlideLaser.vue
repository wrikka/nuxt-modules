<script setup lang="ts">
import { useLaserPointer } from "../../composables/useLaserPointer";

const laser = useLaserPointer();
</script>

<template>
	<div
		v-if="laser.isActive.value"
		class="fixed pointer-events-none z-9999 transition-transform duration-75"
		:style="{
			left: `${laser.position.value.x - laser.size.value / 2}px`,
			top: `${laser.position.value.y - laser.size.value / 2}px`,
			width: `${laser.size.value}px`,
			height: `${laser.size.value}px`,
		}"
	>
		<div
			class="w-full h-full rounded-full animate-pulse"
			:style="{
				backgroundColor: laser.color.value,
				boxShadow: `0 0 ${laser.size.value}px ${laser.color.value}, 0 0 ${laser.size.value * 2}px ${laser.color.value}`,
			}"
		/>
	</div>
</template>
