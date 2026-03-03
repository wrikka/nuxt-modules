<script setup lang="ts">
interface Props {
	canvasId: string;
	width: number;
	height: number;
	backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
	backgroundColor: "#ffffff",
});

const emit = defineEmits<{
	ready: [];
	elementAdded: [element: unknown];
	elementModified: [element: unknown];
	elementRemoved: [element: unknown];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { initCanvas, canvas, isInitialized } = useCanvas(props.canvasId);

onMounted(() => {
	if (canvasRef.value) {
		initCanvas(props.width, props.height);
		emit("ready");
	}
});

watch(() => [props.width, props.height, props.backgroundColor], () => {
	if (canvas.value) {
		canvas.value.width = props.width;
		canvas.value.height = props.height;
		canvas.value.backgroundColor = props.backgroundColor;
		canvas.value.renderAll();
	}
}, { deep: true });

defineExpose({
	canvas,
	isInitialized,
});
</script>

<template>
	<div class="relative bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 overflow-hidden">
		<canvas ref="canvasRef" :id="canvasId"></canvas>
	</div>
</template>
