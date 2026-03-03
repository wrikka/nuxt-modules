<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "update", variables: TemplateVariable[]): void;
}>();

interface TemplateVariable {
	id: string;
	type: "text" | "image" | "color" | "number" | "date";
	name: string;
	label: string;
	defaultValue: string;
	currentValue: string;
	placeholder: string;
	required: boolean;
}

const variables = ref<TemplateVariable[]>([
	{
		id: "1",
		type: "text",
		name: "headline",
		label: "Headline",
		defaultValue: "Your Headline",
		currentValue: "",
		placeholder: "Enter main headline",
		required: true,
	},
	{
		id: "2",
		type: "text",
		name: "subheadline",
		label: "Subheadline",
		defaultValue: "Subheadline text",
		currentValue: "",
		placeholder: "Enter subheadline",
		required: false,
	},
	{
		id: "3",
		type: "image",
		name: "hero_image",
		label: "Hero Image",
		defaultValue: "",
		currentValue: "",
		placeholder: "Upload hero image",
		required: true,
	},
	{
		id: "4",
		type: "image",
		name: "logo",
		label: "Company Logo",
		defaultValue: "",
		currentValue: "",
		placeholder: "Upload logo",
		required: false,
	},
	{
		id: "5",
		type: "color",
		name: "primary_color",
		label: "Primary Color",
		defaultValue: "#3B82F6",
		currentValue: "",
		placeholder: "",
		required: true,
	},
	{
		id: "6",
		type: "color",
		name: "secondary_color",
		label: "Secondary Color",
		defaultValue: "#10B981",
		currentValue: "",
		placeholder: "",
		required: false,
	},
	{
		id: "7",
		type: "text",
		name: "cta_text",
		label: "CTA Button Text",
		defaultValue: "Learn More",
		currentValue: "",
		placeholder: "Enter button text",
		required: true,
	},
	{
		id: "8",
		type: "text",
		name: "cta_url",
		label: "CTA URL",
		defaultValue: "https://",
		currentValue: "",
		placeholder: "Enter destination URL",
		required: false,
	},
]);

const previewVariables = ref<Record<string, string>>({});

const updatePreview = () => {
	previewVariables.value = Object.fromEntries(
		variables.value.map(v => [v.name, v.currentValue || v.defaultValue]),
	);
};

const resetVariables = () => {
	variables.value.forEach(v => {
		v.currentValue = "";
	});
	updatePreview();
};

const fillDefaults = () => {
	variables.value.forEach(v => {
		v.currentValue = v.defaultValue;
	});
	updatePreview();
};

const addVariable = () => {
	const id = String(variables.value.length + 1);
	variables.value.push({
		id,
		type: "text",
		name: `variable_${id}`,
		label: "New Variable",
		defaultValue: "",
		currentValue: "",
		placeholder: "",
		required: false,
	});
};

const removeVariable = (id: string) => {
	const index = variables.value.findIndex(v => v.id === id);
	if (index > -1) {
		variables.value.splice(index, 1);
	}
};

const saveVariables = () => {
	emit("update", variables.value);
};

watch(variables, updatePreview, { deep: true });

onMounted(() => {
	updatePreview();
});
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-variable text-indigo-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Template Variables
							</h2>
							<p class="text-sm text-gray-500">
								Define customizable fields for this template
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
							@click="resetVariables"
						>
							Reset
						</button>
						<button
							class="px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
							@click="fillDefaults"
						>
							Use Defaults
						</button>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Main Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Variables Form -->
					<div class="w-1/2 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">
								Variables ({{ variables.length }})
							</h3>
							<button
								class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
								@click="addVariable"
							>
								<i class="i-mdi-plus" />
								Add Variable
							</button>
						</div>

						<div class="space-y-4">
							<div
								v-for="variable in variables"
								:key="variable.id"
								class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl group"
							>
								<div class="flex items-start gap-3">
									<div class="flex-1 space-y-3">
										<div class="grid grid-cols-2 gap-3">
											<div>
												<label
													class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
												>
													Label
												</label>
												<input
													v-model="variable.label"
													type="text"
													class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
												/>
											</div>
											<div>
												<label
													class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
												>
													Variable Name
												</label>
												<input
													v-model="variable.name"
													type="text"
													class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono"
												/>
											</div>
										</div>

										<div class="grid grid-cols-2 gap-3">
											<div>
												<label
													class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
												>
													Type
												</label>
												<select
													v-model="variable.type"
													class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
												>
													<option value="text">Text</option>
													<option value="image">Image</option>
													<option value="color">Color</option>
													<option value="number">Number</option>
													<option value="date">Date</option>
												</select>
											</div>
											<div>
												<label
													class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
												>
													Default Value
												</label>
												<div class="flex gap-2">
													<input
														v-if="variable.type !== 'color'"
														v-model="variable.defaultValue"
														type="text"
														class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
													/>
													<input
														v-else
														v-model="variable.defaultValue"
														type="color"
														class="w-full h-9 px-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
													/>
												</div>
											</div>
										</div>

										<div>
											<label
												class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
											>
												Current Value
											</label>
											<div class="flex gap-2">
												<input
													v-if="variable.type === 'text'
													|| variable.type === 'number'"
													v-model="variable.currentValue"
													:type="variable.type"
													class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
													:placeholder="variable.placeholder"
												/>
												<input
													v-else-if="variable.type === 'color'"
													v-model="variable.currentValue"
													type="color"
													class="w-12 h-9 px-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
												/>
												<div
													v-else-if="variable.type === 'image'"
													class="flex-1"
												>
													<input
														v-model="variable.currentValue"
														type="text"
														class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
														placeholder="Image URL or path"
													/>
												</div>
												<input
													v-else
													v-model="variable.currentValue"
													type="text"
													class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
													:placeholder="variable.placeholder"
												/>
												<label
													class="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm cursor-pointer"
												>
													<input
														v-model="variable.required"
														type="checkbox"
														class="rounded border-gray-300 text-blue-600"
													/>
													<span class="text-xs">Required</span>
												</label>
											</div>
										</div>
									</div>
									<button
										class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"
										@click="removeVariable(variable.id)"
									>
										<i class="i-mdi-delete" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Preview -->
					<div class="w-1/2 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Live Preview
						</h3>

						<!-- Preview Card -->
						<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
							<div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
								<span class="text-gray-400">
									{{ previewVariables.hero_image || "Hero Image" }}
								</span>
							</div>
							<div class="p-6">
								<h2
									class="text-2xl font-bold mb-2"
									:style="`color: ${previewVariables.primary_color || '#3B82F6'}`"
								>
									{{ previewVariables.headline || "Your Headline" }}
								</h2>
								<p class="text-gray-600 dark:text-gray-400 mb-4">
									{{
										previewVariables.subheadline
										|| "Subheadline text goes here"
									}}
								</p>
								<button
									class="px-6 py-3 rounded-lg font-medium transition-colors"
									:style="`background-color: ${
										previewVariables.primary_color || '#3B82F6'
									}; color: white;`"
								>
									{{ previewVariables.cta_text || "Learn More" }}
								</button>
							</div>
						</div>

						<!-- Variable Values Preview -->
						<div class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
							<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
								Current Values
							</h4>
							<pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">{{ JSON.stringify(previewVariables, null, 2) }}</pre>
						</div>

						<!-- Save Button -->
						<button
							class="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
							@click="saveVariables"
						>
							<i class="i-mdi-content-save mr-1" />
							Save Variables
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
