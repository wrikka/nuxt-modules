<script setup lang="ts">
interface CSSProperty {
	name: string;
	value: string;
	type: "color" | "size" | "text" | "number";
}

const props = defineProps<{
	isOpen: boolean;
	selectedElement?: {
		tag: string;
		id: string;
		classes: string[];
	};
}>();

const emit = defineEmits<{
	close: [];
	copyCSS: [css: string];
}>();

const activeTab = ref<"styles" | "css" | "info">("styles");

const styles = ref<CSSProperty[]>([
	{ name: "color", value: "#1F2937", type: "color" },
	{ name: "background-color", value: "#FFFFFF", type: "color" },
	{ name: "font-size", value: "16px", type: "size" },
	{ name: "font-weight", value: "400", type: "text" },
	{ name: "padding", value: "16px", type: "size" },
	{ name: "margin", value: "0", type: "size" },
	{ name: "border-radius", value: "8px", type: "size" },
	{ name: "box-shadow", value: "none", type: "text" },
]);

const generatedCSS = computed(() => {
	return styles.value
		.filter(s => s.value && s.value !== "none")
		.map(s => `  ${s.name}: ${s.value};`)
		.join("\n");
});

const fullCSS = computed(() => {
	const selector = props.selectedElement
		? `.${props.selectedElement.classes.join(".")}`
		: ".element";
	return `${selector} {\n${generatedCSS.value}\n}`;
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-40"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Icon name="mdi:code" class="w-5 h-5 text-orange-500" />
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Style Inspector
				</h3>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<!-- Tabs -->
		<div class="flex border-b border-gray-200 dark:border-gray-700">
			<button
				v-for='tab in ["styles", "css", "info"] as const'
				:key="tab"
				:class="[
					'flex-1 py-3 text-xs font-medium transition-colors capitalize',
					activeTab === tab
						? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
						: 'text-gray-500 dark:text-gray-400 hover:text-gray-700',
				]"
				@click="activeTab = tab"
			>
				{{ tab }}
			</button>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-4">
			<!-- Styles Tab -->
			<div v-if="activeTab === 'styles'" class="space-y-3">
				<div
					v-for="style in styles"
					:key="style.name"
					class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
				>
					<span class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{
						style.name
					}}</span>
					<div class="flex items-center gap-2">
						<input
							v-if="style.type === 'color'"
							v-model="style.value"
							type="color"
							class="w-8 h-8 rounded cursor-pointer"
						>
						<input
							v-else
							v-model="style.value"
							type="text"
							class="w-24 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm text-right"
						>
					</div>
				</div>
			</div>

			<!-- CSS Tab -->
			<div v-if="activeTab === 'css'" class="space-y-3">
				<div class="relative">
					<pre class="p-4 bg-gray-900 rounded-lg text-sm text-gray-300 font-mono overflow-x-auto"><code>{{ fullCSS }}</code></pre>
					<button
						class="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded"
						@click="emit('copyCSS', fullCSS)"
					>
						<Icon name="mdi:content-copy" class="w-4 h-4" />
					</button>
				</div>
			</div>

			<!-- Info Tab -->
			<div v-if="activeTab === 'info'" class="space-y-4">
				<div v-if="selectedElement" class="space-y-3">
					<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<span class="text-xs text-gray-500 dark:text-gray-400 block mb-1"
						>Tag</span>
						<span class="text-sm font-mono text-gray-900 dark:text-white"
						>&lt;{{ selectedElement.tag }}&gt;</span>
					</div>
					<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<span class="text-xs text-gray-500 dark:text-gray-400 block mb-1"
						>ID</span>
						<span class="text-sm font-mono text-gray-900 dark:text-white">#{{
								selectedElement.id
							}}</span>
					</div>
					<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<span class="text-xs text-gray-500 dark:text-gray-400 block mb-1"
						>Classes</span>
						<div class="flex flex-wrap gap-1 mt-1">
							<span
								v-for="cls in selectedElement.classes"
								:key="cls"
								class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded"
							>
								.{{ cls }}
							</span>
						</div>
					</div>
				</div>
				<div v-else class="text-center py-8">
					<Icon
						name="mdi:cursor-pointer"
						class="w-12 h-12 text-gray-300 mx-auto mb-3"
					/>
					<p class="text-sm text-gray-500">Select an element to view details</p>
				</div>
			</div>
		</div>
	</div>
</template>
