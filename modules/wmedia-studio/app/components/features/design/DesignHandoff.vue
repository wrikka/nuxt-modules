<script setup lang="ts">
const specs = ref([
	{
		element: "Header",
		properties: [{ name: "Font Size", value: "32px" }, {
			name: "Color",
			value: "#1a1a1a",
		}, { name: "Weight", value: "700" }],
	},
	{
		element: "Button Primary",
		properties: [{ name: "Background", value: "#3B82F6" }, {
			name: "Padding",
			value: "12px 24px",
		}, { name: "Border Radius", value: "8px" }],
	},
]);
const code = ref({
	css: ".button { background: #3B82F6; padding: 12px 24px; }",
	react: "<Button className=\"bg-blue-500 px-6 py-3\">Click me</Button>",
	vue: "<button class=\"bg-blue-500 px-6 py-3\">Click me</button>",
});
const activeTab = ref<"css" | "react" | "vue">("css");
const copied = ref(false);
const copyCode = () => {
	navigator.clipboard.writeText(code.value[activeTab.value]);
	copied.value = true;
	setTimeout(() => copied.value = false, 2000);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
			Design Handoff
		</h3>

		<div class="space-y-4 mb-6">
			<div
				v-for="spec in specs"
				:key="spec.element"
				class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
			>
				<p class="font-medium text-sm mb-2">{{ spec.element }}</p>
				<div class="grid grid-cols-3 gap-2">
					<div
						v-for="prop in spec.properties"
						:key="prop.name"
						class="p-2 bg-white dark:bg-gray-800 rounded"
					>
						<p class="text-xs text-gray-500">{{ prop.name }}</p>
						<div class="flex items-center gap-1">
							<div
								v-if="prop.name.includes('Color')"
								class="w-3 h-3 rounded"
								:style="{ backgroundColor: prop.value }"
							/>
							<p class="text-sm font-mono">{{ prop.value }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="border rounded-lg overflow-hidden">
			<div class="flex border-b">
				<button
					v-for='tab in ["css", "react", "vue"] as const'
					:key="tab"
					@click="activeTab = tab"
					:class="{ 'bg-blue-500 text-white': activeTab === tab }"
					class="px-4 py-2 text-sm capitalize"
				>
					{{ tab }}
				</button>
				<button
					@click="copyCode"
					class="ml-auto px-4 py-2 text-sm flex items-center gap-1"
				>
					<Icon
						:name="copied ? 'mdi:check' : 'mdi:content-copy'"
						class="w-4 h-4"
					/>
					{{ copied ? "Copied!" : "Copy" }}
				</button>
			</div>
			<pre class="p-4 bg-gray-900 text-green-400 text-sm overflow-x-auto"><code>{{ code[activeTab] }}</code></pre>
		</div>
	</div>
</template>
