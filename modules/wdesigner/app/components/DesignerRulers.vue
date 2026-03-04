<script setup lang="ts">
interface Props {
	width: number;
	height: number;
	zoom: number;
	showRulers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	showRulers: true,
});

const emit = defineEmits<{
	addGuide: [orientation: "horizontal" | "vertical", position: number];
}>();

const rulerSize = 20;

const horizontalTicks = computed(() => {
	const ticks = [];
	const step = props.zoom < 0.5 ? 100 : props.zoom < 1 ? 50 : 20;
	for (let i = 0; i <= props.width; i += step) {
		ticks.push({
			position: i,
			label: i % (step * 5) === 0 ? i : null,
			isMajor: i % (step * 5) === 0,
		});
	}
	return ticks;
});

const verticalTicks = computed(() => {
	const ticks = [];
	const step = props.zoom < 0.5 ? 100 : props.zoom < 1 ? 50 : 20;
	for (let i = 0; i <= props.height; i += step) {
		ticks.push({
			position: i,
			label: i % (step * 5) === 0 ? i : null,
			isMajor: i % (step * 5) === 0,
		});
	}
	return ticks;
});

const handleHorizontalRulerClick = (e: MouseEvent) => {
	const rect = (e.target as HTMLElement).getBoundingClientRect();
	const x = (e.clientX - rect.left) / props.zoom;
	emit("addGuide", "vertical", Math.round(x));
};

const handleVerticalRulerClick = (e: MouseEvent) => {
	const rect = (e.target as HTMLElement).getBoundingClientRect();
	const y = (e.clientY - rect.top) / props.zoom;
	emit("addGuide", "horizontal", Math.round(y));
};
</script>

<template>
	<div v-if="showRulers" class="pointer-events-none">
		<!-- Horizontal Ruler -->
		<div
			class="absolute top-0 left-0 h-5 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 pointer-events-auto cursor-crosshair"
			:style="{ width: `${width * zoom + rulerSize}px`, marginLeft: `${rulerSize}px` }"
			@click="handleHorizontalRulerClick"
		>
			<div class="relative w-full h-full">
				<div
					v-for="tick in horizontalTicks"
					:key="`h-${tick.position}`"
					class="absolute bottom-0 border-gray-400 dark:border-gray-500"
					:style="{
						left: `${tick.position * zoom}px`,
						height: tick.isMajor ? '12px' : '6px',
						borderLeft: '1px solid',
					}"
				>
					<span
						v-if="tick.label"
						class="absolute -top-1 left-0.5 text-[9px] text-gray-600 dark:text-gray-400 select-none"
					>
						{{ tick.label }}
					</span>
				</div>
			</div>
		</div>

		<!-- Vertical Ruler -->
		<div
			class="absolute top-0 left-0 w-5 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 pointer-events-auto cursor-crosshair"
			:style="{
				height: `${height * zoom + rulerSize}px`,
				marginTop: `${rulerSize}px`,
			}"
			@click="handleVerticalRulerClick"
		>
			<div class="relative w-full h-full">
				<div
					v-for="tick in verticalTicks"
					:key="`v-${tick.position}`"
					class="absolute right-0 border-gray-400 dark:border-gray-500"
					:style="{
						top: `${tick.position * zoom}px`,
						width: tick.isMajor ? '12px' : '6px',
						borderTop: '1px solid',
					}"
				>
					<span
						v-if="tick.label"
						class="absolute top-0.5 left-4 text-[9px] text-gray-600 dark:text-gray-400 select-none -rotate-90 origin-left"
					>
						{{ tick.label }}
					</span>
				</div>
			</div>
		</div>

		<!-- Corner -->
		<div
			v-if="showRulers"
			class="absolute top-0 left-0 w-5 h-5 bg-gray-100 dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-600"
		/>
	</div>
</template>
