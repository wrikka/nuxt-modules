<script setup lang="ts">
export interface GradientStop {
	color: string;
	position: number;
}

export interface GradientConfig {
	type: "linear" | "radial";
	angle: number;
	stops: GradientStop[];
}

const props = defineProps<{
	modelValue: GradientConfig;
}>();

const emit = defineEmits<{
	updateModelValue: [value: GradientConfig];
}>();

const gradientBarRef = ref<HTMLDivElement | null>(null);
const draggingStopIndex = ref<number | null>(null);

const updateGradient = (updates: Partial<GradientConfig>) => {
	emit("updateModelValue", { ...props.modelValue, ...updates });
};

const addStop = (event: MouseEvent) => {
	const bar = gradientBarRef.value;
	if (!bar) return;

	const rect = bar.getBoundingClientRect();
	const position = Math.max(
		0,
		Math.min(100, ((event.clientX - rect.left) / rect.width) * 100),
	);

	const newStops = [...props.modelValue.stops];
	newStops.push({ color: "#ffffff", position });
	newStops.sort((a, b) => a.position - b.position);
	updateGradient({ stops: newStops });
};

const removeStop = (index: number) => {
	if (props.modelValue.stops.length <= 2) return;
	const newStops = props.modelValue.stops.filter((_, i) => i !== index);
	updateGradient({ stops: newStops });
};

const handleStopMouseDown = (index: number, event: MouseEvent) => {
	event.stopPropagation();
	draggingStopIndex.value = index;
};

const handleMouseMove = (event: MouseEvent) => {
	if (draggingStopIndex.value === null) return;

	const bar = gradientBarRef.value;
	if (!bar) return;

	const rect = bar.getBoundingClientRect();
	const position = Math.max(
		0,
		Math.min(100, ((event.clientX - rect.left) / rect.width) * 100),
	);

	const newStops = [...props.modelValue.stops];
	newStops[draggingStopIndex.value] = {
		...newStops[draggingStopIndex.value]!,
		position,
	};
	newStops.sort((a, b) => a.position - b.position);
	updateGradient({ stops: newStops });
};

const handleMouseUp = () => {
	draggingStopIndex.value = null;
};

const updateStopColor = (index: number, color: string) => {
	const newStops = [...props.modelValue.stops];
	newStops[index] = { ...newStops[index]!, color };
	updateGradient({ stops: newStops });
};

const gradientStyle = computed(() => {
	const { type, angle, stops } = props.modelValue;
	const sortedStops = [...stops].sort((a, b) => a.position - b.position);
	const stopsString = sortedStops.map(s => `${s.color} ${s.position}%`).join(
		", ",
	);

	if (type === "linear") {
		return `linear-gradient(${angle}deg, ${stopsString})`;
	}
	return `radial-gradient(circle, ${stopsString})`;
});

const cssGradient = computed(() => {
	return gradientStyle.value;
});

onMounted(() => {
	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);
});

onUnmounted(() => {
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("mouseup", handleMouseUp);
});
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center gap-2">
			<label class="text-xs text-gray-600 dark:text-gray-400">Type:</label>
			<select
				:value="modelValue.type"
				class="text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1"
				@change="updateGradient({
					type: ($event.target as HTMLSelectElement).value as
						| 'linear'
						| 'radial',
				})"
			>
				<option value="linear">Linear</option>
				<option value="radial">Radial</option>
			</select>
		</div>

		<div v-if="modelValue.type === 'linear'" class="flex items-center gap-2">
			<label class="text-xs text-gray-600 dark:text-gray-400">Angle:</label>
			<input
				type="range"
				min="0"
				max="360"
				:value="modelValue.angle"
				class="w-24"
				@input="updateGradient({
					angle: Number(($event.target as HTMLInputElement).value),
				})"
			>
			<span class="text-xs text-gray-600 dark:text-gray-400 w-8">{{
					modelValue.angle
				}}°</span>
		</div>

		<div
			ref="gradientBarRef"
			class="h-8 rounded cursor-crosshair relative border border-gray-300 dark:border-gray-600"
			:style="{ background: cssGradient }"
			@click="addStop"
		>
			<div
				v-for="(stop, index) in modelValue.stops"
				:key="index"
				class="absolute top-0 w-3 h-full cursor-move transform -translate-x-1/2 group"
				:style="{ left: `${stop.position}%` }"
				@mousedown="handleStopMouseDown(index, $event)"
			>
				<div
					class="w-3 h-3 rounded-full border-2 border-white shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					:style="{ backgroundColor: stop.color }"
				/>
				<button
					v-if="modelValue.stops.length > 2"
					class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center"
					@click.stop="removeStop(index)"
				>
					×
				</button>
			</div>
		</div>

		<div class="space-y-2 max-h-32 overflow-y-auto">
			<div
				v-for="(stop, index) in modelValue.stops"
				:key="index"
				class="flex items-center gap-2"
			>
				<input
					type="color"
					:value="stop.color"
					class="w-6 h-6 rounded cursor-pointer"
					@input="updateStopColor(index, ($event.target as HTMLInputElement).value)"
				>
				<input
					type="number"
					min="0"
					max="100"
					:value="Math.round(stop.position)"
					class="w-16 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					@input="updateGradient({
						stops: modelValue.stops.map((s, i) =>
							i === index
								? {
									...s,
									position: Number(($event.target as HTMLInputElement).value),
								}
								: s
						),
					})"
				>
				<span class="text-xs text-gray-500">%</span>
			</div>
		</div>
	</div>
</template>
