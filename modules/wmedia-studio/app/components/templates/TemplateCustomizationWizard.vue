<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits<{
	(e: "complete", settings: WizardSettings): void;
	(e: "close"): void;
}>();

interface WizardSettings {
	colors: string[];
	font: string;
	logo: string | null;
	style: string;
}

const currentStep = ref(0);
const steps = ["Brand Colors", "Typography", "Logo", "Style"];

const settings = ref<WizardSettings>({
	colors: ["#3B82F6", "#10B981", "#F59E0B"],
	font: "Inter",
	logo: null,
	style: "modern",
});

const presetColors = [
	["#3B82F6", "#10B981", "#F59E0B"],
	["#EF4444", "#8B5CF6", "#EC4899"],
	["#1E293B", "#64748B", "#CBD5E1"],
	["#0EA5E9", "#06B6D4", "#14B8A6"],
];

const fonts = [
	"Inter",
	"Roboto",
	"Playfair Display",
	"Poppins",
	"Montserrat",
	"Open Sans",
];
const styles = [
	{ value: "modern", label: "Modern Minimal", icon: "i-mdi-minus" },
	{ value: "bold", label: "Bold & Vibrant", icon: "i-mdi-flash" },
	{ value: "elegant", label: "Elegant Classic", icon: "i-mdi-crown" },
	{ value: "playful", label: "Playful Fun", icon: "i-mdi-emoticon-happy" },
];

const canProceed = computed(() => {
	return settings.value.colors.length > 0 && settings.value.font
		&& settings.value.style;
});

const handleNext = () => {
	if (currentStep.value < steps.length - 1) {
		currentStep.value++;
	} else {
		emit("complete", settings.value);
	}
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl">
				<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Template Customization Wizard
					</h2>
					<div class="flex items-center gap-2 mt-3">
						<div
							v-for="(step, index) in steps"
							:key="step"
							class="flex items-center gap-2"
						>
							<div
								class="w-8 h-8 rounded-full flex items-center justify-center text-sm"
								:class="currentStep >= index
								? 'bg-blue-600 text-white'
								: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
							>
								{{ index + 1 }}
							</div>
							<span
								v-if="index < steps.length - 1"
								class="w-8 h-px bg-gray-300 dark:bg-gray-600"
							/>
						</div>
					</div>
				</div>

				<div class="p-6 min-h-[300px]">
					<!-- Step 1: Colors -->
					<div v-if="currentStep === 0" class="space-y-4">
						<h3 class="font-medium text-gray-900 dark:text-white">
							Select Brand Colors
						</h3>
						<div class="grid grid-cols-2 gap-3">
							<button
								v-for="palette in presetColors"
								:key="palette.join(',')"
								class="flex gap-2 p-3 rounded-lg border-2 transition-all"
								:class="settings.colors.join(',') === palette.join(',')
								? 'border-blue-500'
								: 'border-gray-200 dark:border-gray-700'"
								@click="settings.colors = palette"
							>
								<div
									v-for="color in palette"
									:key="color"
									class="w-8 h-8 rounded-full"
									:style="{ backgroundColor: color }"
								/>
							</button>
						</div>
						<div class="flex items-center gap-3 mt-4">
							<span class="text-sm text-gray-600 dark:text-gray-400"
							>Custom:</span>
							<input
								v-for="(color, index) in settings.colors"
								:key="index"
								type="color"
								v-model="settings.colors[index]"
								class="w-10 h-10 rounded cursor-pointer"
							/>
						</div>
					</div>

					<!-- Step 2: Typography -->
					<div v-else-if="currentStep === 1" class="space-y-3">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Choose Primary Font
						</h3>
						<label
							v-for="font in fonts"
							:key="font"
							class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
							:class="settings.font === font
							? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: 'border-gray-200 dark:border-gray-700'"
						>
							<input
								v-model="settings.font"
								type="radio"
								:value="font"
								class="w-4 h-4"
							/>
							<span :style="{ fontFamily: font }" class="text-lg">{{
								font
							}}</span>
							<span class="text-sm text-gray-500 dark:text-gray-400 ml-auto"
							>Aa</span>
						</label>
					</div>

					<!-- Step 3: Logo -->
					<div v-else-if="currentStep === 2" class="space-y-4">
						<h3 class="font-medium text-gray-900 dark:text-white">
							Upload Logo (Optional)
						</h3>
						<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
							<i class="i-mdi-cloud-upload text-4xl text-gray-400 mb-4" />
							<p class="text-gray-600 dark:text-gray-400">
								Drop logo here or click to browse
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
								SVG, PNG, or JPG up to 5MB
							</p>
						</div>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="rounded" />
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Use brand kit logo instead</span>
						</label>
					</div>

					<!-- Step 4: Style -->
					<div v-else class="space-y-3">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Select Visual Style
						</h3>
						<button
							v-for="style in styles"
							:key="style.value"
							class="w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all"
							:class="settings.style === style.value
							? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: 'border-gray-200 dark:border-gray-700'"
							@click="settings.style = style.value"
						>
							<div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
								<i :class="style.icon" class="text-white text-2xl" />
							</div>
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{{ style.label }}
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">
									{{
										style.value === "modern"
										? "Clean lines, ample whitespace"
										: style.value === "bold"
										? "Strong colors, high contrast"
										: style.value === "elegant"
										? "Refined, sophisticated look"
										: "Fun, approachable design"
									}}
								</div>
							</div>
						</button>
					</div>
				</div>

				<div class="flex justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						v-if="currentStep > 0"
						class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="currentStep--"
					>
						Back
					</button>
					<div v-else />
					<button
						:disabled="!canProceed"
						class="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
						@click="handleNext"
					>
						{{ currentStep === steps.length - 1 ? "Create Template" : "Next" }}
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
