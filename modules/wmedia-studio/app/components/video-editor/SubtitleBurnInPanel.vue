<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	burnIn: [settings: BurnInSettings];
}>();

interface BurnInSettings {
	style: "default" | "minimal" | "boxed" | "outline";
	position: "bottom" | "top" | "middle";
	fontSize: number;
	fontColor: string;
	backgroundColor: string;
	backgroundOpacity: number;
	strokeWidth: number;
	includeSpeaker: boolean;
	includeTimecode: boolean;
	outline: boolean;
	shadow: boolean;
}

const settings = ref<BurnInSettings>({
	style: "default",
	position: "bottom",
	fontSize: 24,
	fontColor: "#ffffff",
	backgroundColor: "#000000",
	backgroundOpacity: 50,
	strokeWidth: 0,
	includeSpeaker: false,
	includeTimecode: false,
	outline: true,
	shadow: true,
});

const styles = [
	{ id: "default", name: "Default", preview: "Hello World" },
	{ id: "minimal", name: "Minimal", preview: "Hello World" },
	{ id: "boxed", name: "Boxed", preview: "Hello World" },
	{ id: "outline", name: "Outline", preview: "Hello World" },
];

const positions = [
	{ id: "bottom", name: "Bottom", icon: "i-ph-align-bottom" },
	{ id: "middle", name: "Middle", icon: "i-ph-align-center-vertical" },
	{ id: "top", name: "Top", icon: "i-ph-align-top" },
];

const handleBurnIn = () => {
	emit("burnIn", settings.value);
};
</script>

<template>
	<div class="subtitle-burnin-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:subtitles" class="w-5 h-5 text-blue-500" />
				Subtitle Burn-in
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Preview -->
		<div class="mb-4 aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="text-gray-400 dark:text-gray-600 text-sm">
					Video Preview
				</div>
			</div>
			<!-- Subtitle Preview -->
			<div
				class="absolute left-1/2 -translate-x-1/2 px-4 py-2"
				:style="{
					top: settings.position === 'top'
						? '10%'
						: settings.position === 'middle'
						? '50%'
						: 'auto',
					bottom: settings.position === 'bottom' ? '10%' : 'auto',
					transform: settings.position === 'middle'
						? 'translate(-50%, -50%)'
						: 'translateX(-50%)',
					fontSize: `${settings.fontSize}px`,
					color: settings.fontColor,
					backgroundColor: settings.style === 'boxed'
						? `${settings.backgroundColor}${
							Math.round(settings.backgroundOpacity * 2.55).toString(16)
								.padStart(2, '0')
						}`
						: 'transparent',
					WebkitTextStroke: settings.outline || settings.style === 'outline'
						? `${settings.strokeWidth || 1}px black`
						: 'none',
					textShadow: settings.shadow ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
					fontWeight: settings.style === 'outline' ? 'bold' : 'normal',
				}"
			>
				This is a sample subtitle
			</div>
		</div>

		<!-- Style Selection -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Subtitle Style</label>
			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="style in styles"
					:key="style.id"
					class="p-3 rounded-lg transition-colors text-center"
					:class="settings.style === style.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="settings.style = style.id as any"
				>
					<div class="text-gray-900 dark:text-white text-sm font-medium">
						{{ style.name }}
					</div>
				</button>
			</div>
		</div>

		<!-- Position -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Position</label>
			<div class="flex gap-2">
				<button
					v-for="pos in positions"
					:key="pos.id"
					class="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
					:class="settings.position === pos.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="settings.position = pos.id as any"
				>
					<span
						:class="[pos.icon, 'w-5 h-5 text-gray-500 dark:text-gray-400']"
					/>
					<span class="text-gray-700 dark:text-gray-300 text-xs">{{
						pos.name
					}}</span>
				</button>
			</div>
		</div>

		<!-- Font Size -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Font Size</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.fontSize
					}}px</span>
			</div>
			<input
				v-model="settings.fontSize"
				type="range"
				min="12"
				max="72"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Background Opacity -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-700 dark:text-gray-300 text-sm"
				>Background Opacity</label>
				<span class="text-blue-500 text-sm font-mono">{{
						settings.backgroundOpacity
					}}%</span>
			</div>
			<input
				v-model="settings.backgroundOpacity"
				type="range"
				min="0"
				max="100"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			>
		</div>

		<!-- Options -->
		<div class="mb-4 space-y-2">
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="settings.outline"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Text Outline
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="settings.shadow"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Drop Shadow
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					v-model="settings.includeSpeaker"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
				Include Speaker Names
			</label>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="handleBurnIn"
			>
				Burn In Subtitles
			</button>
		</div>
	</div>
</template>
