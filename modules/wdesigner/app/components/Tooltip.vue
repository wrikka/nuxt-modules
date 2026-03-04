<script setup lang="ts">
const props = defineProps<{
	content: string;
	position?: "top" | "bottom" | "left" | "right";
}>();

const show = ref(false);
const position = computed(() => props.position || "top");

const positionClasses = {
	top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
	bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
	left: "right-full top-1/2 -translate-y-1/2 mr-2",
	right: "left-full top-1/2 -translate-y-1/2 ml-2",
};
</script>

<template>
	<div
		class="relative inline-block"
		@mouseenter="show = true"
		@mouseleave="show = false"
		@focus="show = true"
		@blur="show = false"
	>
		<slot />
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0 scale-95"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100 scale-100"
			leave-to-class="opacity-0 scale-95"
		>
			<div
				v-if="show"
				class="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg whitespace-nowrap pointer-events-none"
				:class="positionClasses[position]"
				role="tooltip"
			>
				{{ content }}
				<div
					class="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"
					:class="{
						'-bottom-1 left-1/2 -translate-x-1/2': position === 'top',
						'-top-1 left-1/2 -translate-x-1/2': position === 'bottom',
						'-right-1 top-1/2 -translate-y-1/2': position === 'left',
						'-left-1 top-1/2 -translate-y-1/2': position === 'right',
					}"
				/>
			</div>
		</Transition>
	</div>
</template>
