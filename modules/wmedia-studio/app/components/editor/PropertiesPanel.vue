<script setup lang="ts">
import type { Element } from "#shared/types";

const elementStore = useElementStore();

const selectedElement = computed(() => {
	const selectedIds = Array.from(elementStore.selectedElements);
	if (selectedIds.length === 1) {
		return elementStore.elements.get(selectedIds[0]!);
	}
	return null;
});

const updateProperty = (property: string, value: unknown) => {
	const selectedIds = Array.from(elementStore.selectedElements);
	if (selectedIds.length === 1) {
		elementStore.updateElement(selectedIds[0]!, { [property]: value });
	}
};
</script>

<template>
	<div class="w-64 bg-white dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 flex flex-col">
		<div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
			<h2 class="text-sm font-semibold text-gray-900 dark:text-white">
				Properties
			</h2>
		</div>
		<div class="flex-1 overflow-y-auto p-4 space-y-4">
			<div
				v-if="!selectedElement"
				class="text-sm text-gray-500 dark:text-gray-400 text-center py-8"
			>
				Select an element to edit its properties
			</div>
			<div v-else class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Position
					</label>
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>X</label>
							<Input
								type="number"
								:model-value="selectedElement.x"
								@update:model-value="updateProperty('x', $event)"
							/>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Y</label>
							<Input
								type="number"
								:model-value="selectedElement.y"
								@update:model-value="updateProperty('y', $event)"
							/>
						</div>
					</div>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Size
					</label>
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Width</label>
							<Input
								type="number"
								:model-value="selectedElement.width"
								@update:model-value="updateProperty('width', $event)"
							/>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Height</label>
							<Input
								type="number"
								:model-value="selectedElement.height"
								@update:model-value="updateProperty('height', $event)"
							/>
						</div>
					</div>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Rotation
					</label>
					<Input
						type="number"
						:model-value="selectedElement.rotation"
						@update:model-value="updateProperty('rotation', $event)"
					/>
				</div>

				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Opacity
					</label>
					<Input
						type="number"
						:model-value="selectedElement.opacity"
						min="0"
						max="1"
						step="0.1"
						@update:model-value="updateProperty('opacity', $event)"
					/>
				</div>

				<div v-if="selectedElement.type === 'text'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Content
					</label>
					<textarea
						:value="selectedElement.content"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						rows="3"
						@input="updateProperty(
							'content',
							($event.target as HTMLTextAreaElement).value,
						)"
					></textarea>
				</div>

				<div v-if="selectedElement.type === 'text'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Font Size
					</label>
					<Input
						type="number"
						:model-value="selectedElement.fontSize"
						@update:model-value="updateProperty('fontSize', $event)"
					/>
				</div>

				<div v-if="selectedElement.type === 'text'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Color
					</label>
					<input
						type="color"
						:value="selectedElement.color"
						class="w-full h-10 rounded cursor-pointer"
						@input="updateProperty('color', ($event.target as HTMLInputElement).value)"
					/>
				</div>

				<div v-if="selectedElement.type === 'shape'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Fill Color
					</label>
					<input
						type="color"
						:value="selectedElement.fill"
						class="w-full h-10 rounded cursor-pointer"
						@input="updateProperty('fill', ($event.target as HTMLInputElement).value)"
					/>
				</div>

				<div v-if="selectedElement.type === 'shape'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Stroke Color
					</label>
					<input
						type="color"
						:value="selectedElement.stroke"
						class="w-full h-10 rounded cursor-pointer"
						@input="updateProperty(
							'stroke',
							($event.target as HTMLInputElement).value,
						)"
					/>
				</div>

				<div v-if="selectedElement.type === 'shape'">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Stroke Width
					</label>
					<Input
						type="number"
						:model-value="selectedElement.strokeWidth"
						@update:model-value="updateProperty('strokeWidth', $event)"
					/>
				</div>
				<div v-if="selectedElement.type === 'group'">
					<h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
						Auto Layout
					</h3>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>Layout Mode</label>
						<select
							:value="selectedElement.layoutMode"
							@change="updateProperty(
								'layoutMode',
								($event.target as HTMLSelectElement).value,
							)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="none">None</option>
							<option value="horizontal">Horizontal</option>
							<option value="vertical">Vertical</option>
						</select>
					</div>
					<div class="grid grid-cols-2 gap-2 mt-2">
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Padding</label>
							<Input
								type="number"
								:model-value="selectedElement.padding"
								@update:model-value="updateProperty('padding', $event)"
							/>
						</div>
						<div>
							<label class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
							>Gap</label>
							<Input
								type="number"
								:model-value="selectedElement.gap"
								@update:model-value="updateProperty('gap', $event)"
							/>
						</div>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1"
						>Primary Align</label>
						<select
							:value="selectedElement.primaryAlign"
							@change="updateProperty(
								'primaryAlign',
								($event.target as HTMLSelectElement).value,
							)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="start">Start</option>
							<option value="center">Center</option>
							<option value="end">End</option>
							<option value="space-between">Space Between</option>
						</select>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1"
						>Counter Align</label>
						<select
							:value="selectedElement.counterAlign"
							@change="updateProperty(
								'counterAlign',
								($event.target as HTMLSelectElement).value,
							)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="start">Start</option>
							<option value="center">Center</option>
							<option value="end">End</option>
						</select>
					</div>
				</div>
				<div>
					<h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">
						Constraints
					</h3>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>Horizontal</label>
						<select
							:value="selectedElement.horizontalConstraint"
							@change="updateProperty(
								'horizontalConstraint',
								($event.target as HTMLSelectElement).value,
							)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="start">Start</option>
							<option value="center">Center</option>
							<option value="end">End</option>
							<option value="stretch">Stretch</option>
						</select>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1"
						>Vertical</label>
						<select
							:value="selectedElement.verticalConstraint"
							@change="updateProperty(
								'verticalConstraint',
								($event.target as HTMLSelectElement).value,
							)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="start">Start</option>
							<option value="center">Center</option>
							<option value="end">End</option>
							<option value="stretch">Stretch</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
