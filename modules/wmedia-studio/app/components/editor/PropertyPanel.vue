<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	element: {
		id: string;
		name: string;
		type: string;
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number;
		opacity: number;
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
		fontSize?: number;
		fontFamily?: string;
	} | null;
}>();

const emit = defineEmits<{
	close: [];
	update: [updates: Partial<typeof props.element>];
}>();

const fontFamilies = [
	"Inter",
	"Roboto",
	"Open Sans",
	"Poppins",
	"Playfair Display",
	"Montserrat",
];
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-40 flex flex-col"
	>
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<h3 class="font-semibold text-gray-900 dark:text-white">Properties</h3>
			<button
				@click="emit('close')"
				class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<div
			v-if="!element"
			class="flex-1 flex items-center justify-center text-gray-500"
		>
			<p>Select an element to edit</p>
		</div>

		<div v-else class="flex-1 overflow-y-auto p-4 space-y-6">
			<!-- Position & Size -->
			<div>
				<label
					class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block"
				>Position & Size</label>
				<div class="grid grid-cols-2 gap-2">
					<div>
						<span class="text-xs text-gray-400">X</span>
						<input
							type="number"
							:value="element.x"
							@input="emit('update', {
								x: +($event.target as HTMLInputElement).value,
							})"
							class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
						/>
					</div>
					<div>
						<span class="text-xs text-gray-400">Y</span>
						<input
							type="number"
							:value="element.y"
							@input="emit('update', {
								y: +($event.target as HTMLInputElement).value,
							})"
							class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
						/>
					</div>
					<div>
						<span class="text-xs text-gray-400">W</span>
						<input
							type="number"
							:value="element.width"
							@input="emit('update', {
								width: +($event.target as HTMLInputElement).value,
							})"
							class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
						/>
					</div>
					<div>
						<span class="text-xs text-gray-400">H</span>
						<input
							type="number"
							:value="element.height"
							@input="emit('update', {
								height: +($event.target as HTMLInputElement).value,
							})"
							class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
						/>
					</div>
				</div>
			</div>

			<!-- Appearance -->
			<div>
				<label
					class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block"
				>Appearance</label>
				<div class="space-y-3">
					<div>
						<span class="text-xs text-gray-400">Rotation</span>
						<input
							type="range"
							:value="element.rotation"
							@input="emit('update', {
								rotation: +($event.target as HTMLInputElement).value,
							})"
							min="-180"
							max="180"
							class="w-full"
						/>
					</div>
					<div>
						<span class="text-xs text-gray-400">Opacity</span>
						<input
							type="range"
							:value="element.opacity"
							@input="emit('update', {
								opacity: +($event.target as HTMLInputElement).value,
							})"
							min="0"
							max="100"
							class="w-full"
						/>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs text-gray-400">Fill</span>
						<input
							type="color"
							:value="element.fill || '#000000'"
							@input="emit('update', {
								fill: ($event.target as HTMLInputElement).value,
							})"
							class="w-8 h-8 rounded cursor-pointer"
						/>
					</div>
				</div>
			</div>

			<!-- Typography (for text elements) -->
			<div v-if="element.type === 'text'">
				<label
					class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block"
				>Typography</label>
				<div class="space-y-3">
					<select
						:value="element.fontFamily"
						@change="emit('update', {
							fontFamily: ($event.target as HTMLSelectElement).value,
						})"
						class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
					>
						<option v-for="font in fontFamilies" :key="font" :value="font">
							{{ font }}
						</option>
					</select>
					<div>
						<span class="text-xs text-gray-400">Font Size</span>
						<input
							type="number"
							:value="element.fontSize"
							@input="emit('update', {
								fontSize: +($event.target as HTMLInputElement).value,
							})"
							class="w-full px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
