<script setup lang="ts">
type AnnotationTool = "text" | "rectangle" | "circle" | "arrow" | "pen";

interface Annotation {
	id: string;
	type: AnnotationTool;
	x: number;
	y: number;
	content?: string;
	color: string;
	strokeWidth: number;
	width?: number;
	height?: number;
	endX?: number;
	endY?: number;
	path?: { x: number; y: number }[];
}

const currentTool = ref<AnnotationTool>("text");
const textContent = ref("");
const currentColor = ref("#ff0000");
const strokeWidth = ref(3);
const annotations = ref<Annotation[]>([]);

const presetColors = [
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffff00",
	"#ff00ff",
	"#00ffff",
	"#ffffff",
	"#000000",
];

const setTool = (tool: AnnotationTool) => {
	currentTool.value = tool;
};

const addAnnotation = (annotation: Omit<Annotation, "id">) => {
	annotations.value.push({
		...annotation,
		id: crypto.randomUUID(),
	});
};

const undoAnnotation = () => {
	annotations.value.pop();
};

const clearAnnotations = () => {
	annotations.value = [];
};

defineExpose({
	currentTool,
	textContent,
	currentColor,
	strokeWidth,
	annotations,
	addAnnotation,
	undoAnnotation,
	clearAnnotations,
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
			Annotations
		</h2>

		<div class="space-y-4">
			<div class="flex items-center space-x-2">
				<button
					@click="setTool('text')"
					:class="[
						'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all',
						currentTool === 'text'
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					<Icon name="mdi:format-text" class="w-5 h-5" />
					<span>Text</span>
				</button>

				<button
					@click="setTool('rectangle')"
					:class="[
						'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all',
						currentTool === 'rectangle'
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					<Icon name="mdi:rectangle-outline" class="w-5 h-5" />
					<span>Rectangle</span>
				</button>

				<button
					@click="setTool('circle')"
					:class="[
						'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all',
						currentTool === 'circle'
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					<Icon name="mdi:circle-outline" class="w-5 h-5" />
					<span>Circle</span>
				</button>

				<button
					@click="setTool('arrow')"
					:class="[
						'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all',
						currentTool === 'arrow'
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					<Icon name="mdi:arrow-right-bold" class="w-5 h-5" />
					<span>Arrow</span>
				</button>

				<button
					@click="setTool('pen')"
					:class="[
						'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all',
						currentTool === 'pen'
							? 'bg-purple-600 text-white'
							: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
					]"
				>
					<Icon name="mdi:pen" class="w-5 h-5" />
					<span>Pen</span>
				</button>

				<button
					@click="clearAnnotations"
					class="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
				>
					<Icon name="mdi:delete" class="w-5 h-5" />
					<span>Clear All</span>
				</button>
			</div>

			<div v-if="currentTool === 'text'" class="space-y-2">
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Text Content
				</label>
				<input
					v-model="textContent"
					type="text"
					placeholder="Enter text..."
					class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
				/>
			</div>

			<div class="space-y-2">
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Color
				</label>
				<div class="flex items-center space-x-2">
					<input
						v-model="currentColor"
						type="color"
						class="w-10 h-10 rounded cursor-pointer"
					/>
					<div class="flex space-x-1">
						<button
							v-for="color in presetColors"
							:key="color"
							@click="currentColor = color"
							:class="[
								'w-8 h-8 rounded-full border-2 transition-all',
								currentColor === color
									? 'border-purple-500 scale-110'
									: 'border-transparent',
							]"
							:style="{ backgroundColor: color }"
						/>
					</div>
				</div>
			</div>

			<div class="space-y-2">
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Stroke Width: {{ strokeWidth }}px
				</label>
				<input
					v-model.number="strokeWidth"
					type="range"
					min="1"
					max="20"
					class="w-full"
				/>
			</div>

			<div class="flex items-center justify-between">
				<div class="text-sm text-gray-600 dark:text-gray-400">
					{{ annotations.length }} annotations
				</div>
				<button
					@click="undoAnnotation"
					:disabled="annotations.length === 0"
					class="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Icon name="mdi:undo" class="w-4 h-4" />
					<span>Undo</span>
				</button>
			</div>
		</div>
	</div>
</template>
