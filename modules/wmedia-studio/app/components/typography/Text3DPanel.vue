<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const text = ref("3D TEXT");
const settings = reactive({
	depth: 30,
	bevel: 5,
	extrusion: 50,
	lightIntensity: 80,
	rotationX: 15,
	rotationY: 25,
	font: "Bold",
	color: "#3B82F6",
});

const fonts = ["Regular", "Bold", "Italic", "Black"];

const onApply = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="3D Text Effects"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<!-- Text Input -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
				>Text Content</label>
				<input
					v-model="text"
					type="text"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
				/>
			</div>

			<!-- Preview -->
			<div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
				<div
					class="text-4xl font-black transition-transform duration-300"
					:style="{
						color: settings.color,
						textShadow: `${settings.depth / 5}px ${
							settings.depth / 5
						}px 0 ${settings.color}99,
										${settings.depth / 2.5}px ${
							settings.depth / 2.5
						}px 0 ${settings.color}66,
										${settings.depth / 1.5}px ${
							settings.depth / 1.5
						}px 0 ${settings.color}33`,
						transform:
							`perspective(500px) rotateX(${settings.rotationX}deg) rotateY(${settings.rotationY}deg)`,
					}"
				>
					{{ text }}
				</div>
			</div>

			<!-- Font -->
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>Font Style</label>
				<div class="grid grid-cols-4 gap-2">
					<button
						v-for="font in fonts"
						:key="font"
						class="px-3 py-2 rounded-lg text-sm"
						:class="settings.font === font
						? 'bg-blue-500 text-white'
						: 'bg-gray-100 dark:bg-gray-800 text-gray-700'"
						@click="settings.font = font"
					>
						<span
							:class="{
								'font-bold': font === 'Bold' || font === 'Black',
								italic: font === 'Italic',
							}"
						>{{ font }}</span>
					</button>
				</div>
			</div>

			<!-- 3D Settings -->
			<div class="space-y-3">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Depth: {{ settings.depth }}px
					</label>
					<input
						v-model="settings.depth"
						type="range"
						min="0"
						max="100"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Bevel: {{ settings.bevel }}px
					</label>
					<input
						v-model="settings.bevel"
						type="range"
						min="0"
						max="20"
						class="w-full"
					/>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Rotation X: {{ settings.rotationX }}°
						</label>
						<input
							v-model="settings.rotationX"
							type="range"
							min="-45"
							max="45"
							class="w-full"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Rotation Y: {{ settings.rotationY }}°
						</label>
						<input
							v-model="settings.rotationY"
							type="range"
							min="-45"
							max="45"
							class="w-full"
						/>
					</div>
				</div>
			</div>

			<!-- Color -->
			<div class="flex items-center gap-4">
				<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
				>Color</label>
				<input
					v-model="settings.color"
					type="color"
					class="w-16 h-10 rounded cursor-pointer"
				/>
			</div>

			<button
				class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				@click="onApply"
			>
				Apply 3D Text
			</button>
		</div>
	</ModalDialog>
</template>
