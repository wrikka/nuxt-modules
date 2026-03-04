<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: MaskingSettings];
}>();

interface Mask {
	id: string;
	type: "rectangle" | "ellipse" | "polygon" | "freehand" | "gradient" | "luma";
	name: string;
	enabled: boolean;
	inverted: boolean;
	feather: number;
	opacity: number;
	points: Array<{ x: number; y: number }>;
	position: { x: number; y: number };
	scale: { x: number; y: number };
	rotation: number;
}

interface MaskingSettings {
	masks: Mask[];
	selectedMaskId: string | null;
	maskingMode: "alpha" | "luma" | "rgb";
}

const masks = ref<Mask[]>([
	{
		id: "mask-1",
		type: "rectangle",
		name: "Rectangle Mask",
		enabled: true,
		inverted: false,
		feather: 10,
		opacity: 100,
		points: [],
		position: { x: 50, y: 50 },
		scale: { x: 100, y: 100 },
		rotation: 0,
	},
]);

const selectedMaskId = ref<string | null>("mask-1");
const maskingMode = ref<"alpha" | "luma" | "rgb">("alpha");
const showMaskOutline = ref(true);
const isDrawing = ref(false);

const selectedMask = computed(() =>
	masks.value.find(m => m.id === selectedMaskId.value)
);

const activeMasks = computed(() => masks.value.filter(m => m.enabled));

const addMask = (type: Mask["type"]) => {
	const newMask: Mask = {
		id: `mask-${Date.now()}`,
		type,
		name: `${type.charAt(0).toUpperCase() + type.slice(1)} Mask ${
			masks.value.length + 1
		}`,
		enabled: true,
		inverted: false,
		feather: 10,
		opacity: 100,
		points: type === "polygon"
			? [{ x: 25, y: 25 }, { x: 75, y: 25 }, { x: 50, y: 75 }]
			: [],
		position: { x: 50, y: 50 },
		scale: { x: 100, y: 100 },
		rotation: 0,
	};
	masks.value.push(newMask);
	selectedMaskId.value = newMask.id;
};

const removeMask = (id: string) => {
	const index = masks.value.findIndex(m => m.id === id);
	if (index !== -1) {
		masks.value.splice(index, 1);
		if (selectedMaskId.value === id) {
			selectedMaskId.value = masks.value[0]?.id ?? null;
		}
	}
};

const duplicateMask = (id: string) => {
	const mask = masks.value.find(m => m.id === id);
	if (mask) {
		const newMask: Mask = {
			...mask,
			id: `mask-${Date.now()}`,
			name: `${mask.name} (Copy)`,
			position: { x: mask.position.x + 10, y: mask.position.y + 10 },
		};
		masks.value.push(newMask);
		selectedMaskId.value = newMask.id;
	}
};

const toggleMask = (id: string) => {
	const mask = masks.value.find(m => m.id === id);
	if (mask) {
		mask.enabled = !mask.enabled;
	}
};

const selectMask = (id: string) => {
	selectedMaskId.value = id;
};

const resetMask = () => {
	if (selectedMask.value) {
		selectedMask.value.position = { x: 50, y: 50 };
		selectedMask.value.scale = { x: 100, y: 100 };
		selectedMask.value.rotation = 0;
		selectedMask.value.feather = 10;
		selectedMask.value.opacity = 100;
		selectedMask.value.inverted = false;
	}
};

const getMaskIcon = (type: Mask["type"]): string => {
	const icons: Record<string, string> = {
		rectangle: "i-ph-square",
		ellipse: "i-ph-circle",
		polygon: "i-ph-polygon",
		freehand: "i-ph-pencil-simple",
		gradient: "i-ph-gradient",
		luma: "i-ph-sun",
	};
	return icons[type] ?? "i-ph-shape";
};

const handleApply = () => {
	emit("apply", {
		masks: masks.value,
		selectedMaskId: selectedMaskId.value,
		maskingMode: maskingMode.value,
	});
};

const maskTypeOptions = [
	{
		type: "rectangle",
		label: "Rectangle",
		description: "Rectangular mask with rounded corners",
	},
	{ type: "ellipse", label: "Ellipse", description: "Circular or oval mask" },
	{ type: "polygon", label: "Polygon", description: "Custom multi-point mask" },
	{
		type: "freehand",
		label: "Freehand",
		description: "Draw your own mask shape",
	},
	{
		type: "gradient",
		label: "Gradient",
		description: "Linear or radial gradient mask",
	},
	{ type: "luma", label: "Luma Key", description: "Mask based on brightness" },
] as const;
</script>

<template>
	<div class="masking-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[480px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:crop" class="w-5 h-5 text-blue-500" />
				Masking
			</h3>
			<div class="flex items-center gap-2">
				<button
					class="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
					:class="showMaskOutline
					? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
					: ''"
					@click="showMaskOutline = !showMaskOutline"
				>
					<Icon name="mdi:eye" class="w-3 h-3" />
					Outline
				</button>
				<button
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Mode Selection -->
		<div class="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
			<button
				v-for='mode in ["alpha", "luma", "rgb"] as const'
				:key="mode"
				class="flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
				:class="maskingMode === mode
				? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
				: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'"
				@click="maskingMode = mode"
			>
				{{
					mode === "alpha"
					? "Alpha Mask"
					: mode === "luma"
					? "Luma Key"
					: "RGB Key"
				}}
			</button>
		</div>

		<div class="flex gap-4 flex-1 overflow-hidden">
			<!-- Mask List -->
			<div class="w-1/3 flex flex-col gap-2 overflow-y-auto">
				<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
					MASKS
				</div>
				<div
					v-for="mask in masks"
					:key="mask.id"
					class="group relative p-2 rounded-lg cursor-pointer transition-all"
					:class="[
						selectedMaskId === mask.id
							? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
							: 'bg-gray-100 dark:bg-gray-700 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600',
						mask.enabled ? 'opacity-100' : 'opacity-50',
					]"
					@click="selectMask(mask.id)"
				>
					<div class="flex items-center gap-2">
						<span :class="getMaskIcon(mask.type)" class="w-4 h-4" />
						<div class="flex-1 min-w-0">
							<div
								class="text-xs font-medium truncate"
								:class="mask.enabled
								? 'text-gray-900 dark:text-white'
								: 'text-gray-500 dark:text-gray-400'"
							>
								{{ mask.name }}
							</div>
							<div class="text-[10px] text-gray-400 dark:text-gray-500">
								{{ mask.type }}
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							class="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
							:class="mask.enabled ? 'text-green-500' : 'text-gray-400'"
							@click.stop="toggleMask(mask.id)"
						>
							<Icon
								:name="mask.enabled ? 'mdi:eye' : 'mdi:eye-off'"
								class="w-3 h-3"
							/>
						</button>
						<button
							class="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-400 transition-colors"
							@click.stop="duplicateMask(mask.id)"
						>
							<Icon name="mdi:content-copy" class="w-3 h-3" />
						</button>
						<button
							class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
							@click.stop="removeMask(mask.id)"
						>
							<Icon name="mdi:delete" class="w-3 h-3" />
						</button>
					</div>
				</div>

				<!-- Add Mask Button -->
				<div class="relative group">
					<button class="w-full py-2 flex items-center justify-center gap-1 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-lg transition-colors">
						<Icon name="mdi:plus" class="w-4 h-4" />
						Add Mask
					</button>

					<!-- Dropdown -->
					<div class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
						<button
							v-for="option in maskTypeOptions"
							:key="option.type"
							class="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
							@click="addMask(option.type)"
						>
							<span
								:class="getMaskIcon(option.type)"
								class="w-4 h-4 text-gray-500"
							/>
							<div class="flex-1">
								<div class="text-xs font-medium text-gray-700 dark:text-gray-300">
									{{ option.label }}
								</div>
								<div class="text-[10px] text-gray-400">
									{{ option.description }}
								</div>
							</div>
						</button>
					</div>
				</div>
			</div>

			<!-- Mask Properties -->
			<div class="flex-1 flex flex-col overflow-y-auto">
				<div v-if="selectedMask" class="space-y-4">
					<!-- Position -->
					<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
						<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
							POSITION
						</div>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">X</span>
									<span class="text-blue-500">{{
											selectedMask.position.x
										}}%</span>
								</div>
								<input
									v-model="selectedMask.position.x"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">Y</span>
									<span class="text-blue-500">{{
											selectedMask.position.y
										}}%</span>
								</div>
								<input
									v-model="selectedMask.position.y"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</div>

					<!-- Scale -->
					<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
						<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
							SCALE
						</div>
						<div class="grid grid-cols-2 gap-2">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">Width</span>
									<span class="text-blue-500">{{ selectedMask.scale.x }}%</span>
								</div>
								<input
									v-model="selectedMask.scale.x"
									type="range"
									min="0"
									max="200"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">Height</span>
									<span class="text-blue-500">{{ selectedMask.scale.y }}%</span>
								</div>
								<input
									v-model="selectedMask.scale.y"
									type="range"
									min="0"
									max="200"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</div>

					<!-- Rotation -->
					<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-500">Rotation</span>
							<span class="text-blue-500">{{ selectedMask.rotation }}°</span>
						</div>
						<input
							v-model="selectedMask.rotation"
							type="range"
							min="-180"
							max="180"
							class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
						>
					</div>

					<!-- Feather & Opacity -->
					<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
						<div class="grid grid-cols-2 gap-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">Feather</span>
									<span class="text-blue-500">{{
											selectedMask.feather
										}}px</span>
								</div>
								<input
									v-model="selectedMask.feather"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-500">Opacity</span>
									<span class="text-blue-500">{{ selectedMask.opacity }}%</span>
								</div>
								<input
									v-model="selectedMask.opacity"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</div>

					<!-- Invert -->
					<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
						<span class="text-xs text-gray-600 dark:text-gray-400"
						>Invert Mask</span>
						<button
							class="relative w-10 h-5 rounded-full transition-colors"
							:class="selectedMask.inverted
							? 'bg-blue-500'
							: 'bg-gray-300 dark:bg-gray-600'"
							@click="selectedMask.inverted = !selectedMask.inverted"
						>
							<div
								class="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
								:class="selectedMask.inverted ? 'left-5' : 'left-0.5'"
							/>
						</button>
					</div>

					<!-- Reset Button -->
					<button
						class="w-full py-2 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
						@click="resetMask"
					>
						Reset to Default
					</button>
				</div>

				<div
					v-else
					class="flex-1 flex items-center justify-center text-gray-400"
				>
					<div class="text-center">
						<Icon name="mdi:crop" class="w-12 h-12 mb-2 opacity-30" />
						<p class="text-sm">Select or create a mask</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Preview Info -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center justify-between text-xs">
				<span class="text-gray-500 dark:text-gray-400">
					{{ activeMasks.length }} active mask{{
						activeMasks.length === 1 ? "" : "s"
					}}
				</span>
				<span class="text-gray-500 dark:text-gray-400">
					Mode: {{ maskingMode.toUpperCase() }}
				</span>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				@click="handleApply"
			>
				<Icon name="mdi:check" class="w-4 h-4" />
				Apply Masks
			</button>
		</div>
	</div>
</template>
