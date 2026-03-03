<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const selectedEffect = ref("fire");
const settings = reactive({
	intensity: 50,
	speed: 1.0,
	spread: 30,
	color: "#FF6B35",
	count: 100,
	gravity: true,
	collisions: false,
});

const effects = [
	{ id: "fire", name: "Fire", icon: "mdi:fire", color: "#FF6B35" },
	{ id: "smoke", name: "Smoke", icon: "mdi:smoke", color: "#9CA3AF" },
	{
		id: "confetti",
		name: "Confetti",
		icon: "mdi:party-popper",
		color: "#FBBF24",
	},
	{ id: "snow", name: "Snow", icon: "mdi:snowflake", color: "#E5E7EB" },
	{ id: "rain", name: "Rain", icon: "mdi:weather-rainy", color: "#60A5FA" },
	{ id: "sparks", name: "Sparks", icon: "mdi:sparkles", color: "#FCD34D" },
];

const onApply = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Particle Effects Generator"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Create fire, smoke, confetti, and other particle systems for visual
				effects.
			</p>

			<!-- Effect Selector -->
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="effect in effects"
					:key="effect.id"
					class="p-2 rounded-lg text-center border-2 transition-colors"
					:class="selectedEffect === effect.id
					? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
					: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
					@click="selectedEffect = effect.id"
				>
					<Icon
						:name="effect.icon"
						class="w-6 h-6 mx-auto mb-1"
						:style="{ color: effect.color }"
					/>
					<p class="text-xs">{{ effect.name }}</p>
				</button>
			</div>

			<!-- Preview -->
			<div class="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
				<div class="absolute inset-0 flex items-center justify-center">
					<Icon
						:name="effects.find(e => e.id === selectedEffect)?.icon || 'mdi:fire'"
						class="w-16 h-16"
						:style="{ color: settings.color }"
					/>
				</div>
				<div class="absolute bottom-2 left-2 text-xs text-gray-400">
					Particle Preview
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-3">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Intensity: {{ settings.intensity }}%
					</label>
					<input
						v-model="settings.intensity"
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
						Particle Count: {{ settings.count }}
					</label>
					<input
						v-model="settings.count"
						type="range"
						min="10"
						max="500"
						step="10"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Speed: {{ settings.speed }}x
					</label>
					<input
						v-model="settings.speed"
						type="range"
						min="0.1"
						max="3"
						step="0.1"
						class="w-full"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label class="text-sm text-gray-700 dark:text-gray-300">Color</label>
					<input
						v-model="settings.color"
						type="color"
						class="w-10 h-8 rounded cursor-pointer"
					/>
				</div>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input v-model="settings.gravity" type="checkbox" class="rounded" />
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Enable gravity</span>
					</label>
					<label class="flex items-center gap-2">
						<input
							v-model="settings.collisions"
							type="checkbox"
							class="rounded"
						/>
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Particle collisions</span>
					</label>
				</div>
			</div>

			<button
				class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				@click="onApply"
			>
				Apply Particle Effect
			</button>
		</div>
	</ModalDialog>
</template>
