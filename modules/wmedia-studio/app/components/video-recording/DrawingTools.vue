<script setup lang="ts">
const props = defineProps<{
	canvas: HTMLCanvasElement | null;
}>();

const isDrawing = ref(false);
const tool = ref<"pen" | "arrow" | "rect" | "circle" | "text" | "highlight">(
	"pen",
);
const color = ref("#ff0000");
const lineWidth = ref(3);
const isEnabled = ref(false);

const tools: Array<
	{
		id: "pen" | "arrow" | "rect" | "circle" | "text" | "highlight";
		name: string;
		icon: string;
	}
> = [
	{ id: "pen", name: "Pen", icon: "mdi:pencil" },
	{ id: "arrow", name: "Arrow", icon: "mdi:arrow-top-right" },
	{ id: "rect", name: "Rectangle", icon: "mdi:rectangle-outline" },
	{ id: "circle", name: "Circle", icon: "mdi:circle-outline" },
	{ id: "text", name: "Text", icon: "mdi:format-text" },
	{ id: "highlight", name: "Highlight", icon: "mdi:marker" },
];

const colors = [
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffff00",
	"#ff00ff",
	"#00ffff",
	"#ffffff",
	"#000000",
];

let ctx: CanvasRenderingContext2D | null = null;
let startX = 0;
let startY = 0;

const initCanvas = () => {
	if (!props.canvas) return;
	ctx = props.canvas.getContext("2d");
	if (ctx) {
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
	}
};

const startDrawing = (e: MouseEvent) => {
	if (!isEnabled.value || !ctx) return;
	isDrawing.value = true;
	const rect = props.canvas!.getBoundingClientRect();
	startX = e.clientX - rect.left;
	startY = e.clientY - rect.top;

	ctx.beginPath();
	ctx.moveTo(startX, startY);
	ctx.strokeStyle = color.value;
	ctx.lineWidth = tool.value === "highlight"
		? lineWidth.value * 3
		: lineWidth.value;
	if (tool.value === "highlight") {
		ctx.globalAlpha = 0.3;
	} else {
		ctx.globalAlpha = 1;
	}
};

const draw = (e: MouseEvent) => {
	if (!isDrawing.value || !ctx) return;
	const rect = props.canvas!.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	switch (tool.value) {
		case "pen":
		case "highlight":
			ctx.lineTo(x, y);
			ctx.stroke();
			break;
		case "arrow":
		case "rect":
		case "circle":
			// These are drawn on mouse up
			break;
	}
};

const endDrawing = (e: MouseEvent) => {
	if (!isDrawing.value || !ctx) return;
	isDrawing.value = false;
	const rect = props.canvas!.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	ctx.globalAlpha = 1;

	switch (tool.value) {
		case "arrow":
			drawArrow(ctx, startX, startY, x, y);
			break;
		case "rect":
			ctx.strokeRect(startX, startY, x - startX, y - startY);
			break;
		case "circle":
			drawCircle(ctx, startX, startY, x, y);
			break;
	}

	ctx.closePath();
};

const drawArrow = (
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
) => {
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const headLen = 15;

	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(x2, y2);
	ctx.lineTo(
		x2 - headLen * Math.cos(angle - Math.PI / 6),
		y2 - headLen * Math.sin(angle - Math.PI / 6),
	);
	ctx.lineTo(
		x2 - headLen * Math.cos(angle + Math.PI / 6),
		y2 - headLen * Math.sin(angle + Math.PI / 6),
	);
	ctx.closePath();
	ctx.fillStyle = color.value;
	ctx.fill();
};

const drawCircle = (
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
) => {
	const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	ctx.beginPath();
	ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
	ctx.stroke();
};

const clearCanvas = () => {
	if (!ctx || !props.canvas) return;
	ctx.clearRect(0, 0, props.canvas.width, props.canvas.height);
};

watch(() => props.canvas, initCanvas, { immediate: true });
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Drawing Tools
			</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="isEnabled"
					type="checkbox"
					class="w-4 h-4 text-purple-600 rounded"
				/>
				<span class="text-sm text-gray-600 dark:text-gray-400">Enable</span>
			</label>
		</div>

		<div v-if="isEnabled" class="space-y-3">
			<!-- Tools -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="t in tools"
					:key="t.id"
					:class="[
						'p-2 rounded-lg border transition-all flex flex-col items-center gap-1',
						tool === t.id
							? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
							: 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300',
					]"
					@click="tool = t.id"
				>
					<Icon :name="t.icon" class="w-5 h-5" />
					<span class="text-xs">{{ t.name }}</span>
				</button>
			</div>

			<!-- Colors -->
			<div class="flex items-center gap-2">
				<button
					v-for="c in colors"
					:key="c"
					:class="[
						'w-6 h-6 rounded-full border-2 transition-all',
						color === c
							? 'border-gray-900 dark:border-white scale-110'
							: 'border-transparent',
					]"
					:style="{ backgroundColor: c }"
					@click="color = c"
				/>
			</div>

			<!-- Line Width -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Line Width: {{ lineWidth }}px</label>
				<input
					v-model.number="lineWidth"
					type="range"
					min="1"
					max="20"
					class="w-full"
				/>
			</div>

			<!-- Clear -->
			<button
				class="w-full py-2 px-4 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
				@click="clearCanvas"
			>
				<Icon name="mdi:delete" class="w-4 h-4 inline mr-1" />
				Clear All
			</button>
		</div>
	</div>
</template>
