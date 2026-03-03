<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "apply", animation: AnimationPreset): void;
}>();

interface AnimationPreset {
	id: string;
	name: string;
	category: string;
	duration: number;
	easing: string;
	preview: string;
	description: string;
}

const categories = ["Entrance", "Exit", "Attention", "Transition", "Loop"];
const selectedCategory = ref("Entrance");
const selectedAnimation = ref<string | null>(null);

const animations = ref<AnimationPreset[]>([
	// Entrance
	{
		id: "fade-in",
		name: "Fade In",
		category: "Entrance",
		duration: 0.5,
		easing: "ease-out",
		preview: "opacity: 0 → 1",
		description: "Smooth fade from transparent to visible",
	},
	{
		id: "slide-up",
		name: "Slide Up",
		category: "Entrance",
		duration: 0.6,
		easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		preview: "translateY: 50px → 0",
		description: "Slide in from below with bounce",
	},
	{
		id: "slide-left",
		name: "Slide Left",
		category: "Entrance",
		duration: 0.5,
		easing: "ease-out",
		preview: "translateX: -100% → 0",
		description: "Enter from the left side",
	},
	{
		id: "scale-in",
		name: "Scale In",
		category: "Entrance",
		duration: 0.4,
		easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
		preview: "scale: 0 → 1",
		description: "Pop in with slight overshoot",
	},
	{
		id: "flip-in",
		name: "Flip In",
		category: "Entrance",
		duration: 0.6,
		easing: "ease-out",
		preview: "rotateY: 90deg → 0",
		description: "3D flip effect",
	},

	// Exit
	{
		id: "fade-out",
		name: "Fade Out",
		category: "Exit",
		duration: 0.3,
		easing: "ease-in",
		preview: "opacity: 1 → 0",
		description: "Smooth fade to transparent",
	},
	{
		id: "slide-down",
		name: "Slide Down",
		category: "Exit",
		duration: 0.4,
		easing: "ease-in",
		preview: "translateY: 0 → 100%",
		description: "Exit downward",
	},
	{
		id: "scale-out",
		name: "Scale Out",
		category: "Exit",
		duration: 0.3,
		easing: "ease-in",
		preview: "scale: 1 → 0",
		description: "Shrink to nothing",
	},

	// Attention
	{
		id: "pulse",
		name: "Pulse",
		category: "Attention",
		duration: 1,
		easing: "ease-in-out",
		preview: "scale: 1 → 1.05 → 1",
		description: "Subtle pulsing effect",
	},
	{
		id: "shake",
		name: "Shake",
		category: "Attention",
		duration: 0.5,
		easing: "ease-in-out",
		preview: "translateX: ±10px",
		description: "Horizontal shake for emphasis",
	},
	{
		id: "bounce",
		name: "Bounce",
		category: "Attention",
		duration: 0.6,
		easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
		preview: "translateY bounce",
		description: "Playful bounce effect",
	},
	{
		id: "wiggle",
		name: "Wiggle",
		category: "Attention",
		duration: 0.5,
		easing: "ease-in-out",
		preview: "rotate: ±5deg",
		description: "Playful rotation wiggle",
	},

	// Loop
	{
		id: "float",
		name: "Float",
		category: "Loop",
		duration: 3,
		easing: "ease-in-out",
		preview: "translateY: ±10px",
		description: "Gentle floating motion",
	},
	{
		id: "glow",
		name: "Glow",
		category: "Loop",
		duration: 2,
		easing: "ease-in-out",
		preview: "box-shadow pulse",
		description: "Pulsing glow effect",
	},
	{
		id: "spin-slow",
		name: "Slow Spin",
		category: "Loop",
		duration: 8,
		easing: "linear",
		preview: "rotate: 0 → 360deg",
		description: "Continuous slow rotation",
	},
]);

const filteredAnimations = computed(() => {
	return animations.value.filter(a => a.category === selectedCategory.value);
});

const customDuration = ref(0.5);
const customDelay = ref(0);
const customEasing = ref("ease-out");

const easings = [
	"linear",
	"ease",
	"ease-in",
	"ease-out",
	"ease-in-out",
	"cubic-bezier(0.68, -0.55, 0.265, 1.55)",
	"cubic-bezier(0.175, 0.885, 0.32, 1.275)",
];

const applyAnimation = (anim: AnimationPreset) => {
	emit("apply", { ...anim, duration: customDuration.value });
};
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
						<div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-animation text-pink-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Animation Library
							</h2>
							<p class="text-sm text-gray-500">
								Add motion to your template
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Main Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Categories & List -->
					<div class="w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
						<!-- Categories -->
						<div class="flex flex-wrap gap-2 mb-4">
							<button
								v-for="cat in categories"
								:key="cat"
								class="px-3 py-1.5 text-sm rounded-full border transition-colors"
								:class="selectedCategory === cat
								? 'bg-blue-600 text-white border-blue-600'
								: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'"
								@click="selectedCategory = cat"
							>
								{{ cat }}
							</button>
						</div>

						<!-- Animation List -->
						<div class="space-y-2">
							<button
								v-for="anim in filteredAnimations"
								:key="anim.id"
								class="w-full p-3 text-left rounded-xl border transition-all"
								:class="selectedAnimation === anim.id
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
								@click="selectedAnimation = anim.id"
							>
								<div class="flex items-center justify-between">
									<span class="font-medium text-gray-900 dark:text-white">{{
										anim.name
									}}</span>
									<span class="text-xs text-gray-500">{{
											anim.duration
										}}s</span>
								</div>
								<p class="text-xs text-gray-500 mt-1">{{ anim.description }}</p>
							</button>
						</div>
					</div>

					<!-- Center: Preview -->
					<div class="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<div class="max-w-lg mx-auto">
							<h3 class="font-medium text-gray-900 dark:text-white mb-4">
								Preview
							</h3>

							<div class="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden">
								<img
									:src="props.template!.thumbnail"
									class="absolute inset-0 w-full h-full object-cover opacity-30"
								/>
								<div
									class="w-32 h-32 bg-blue-500 rounded-xl flex items-center justify-center text-white text-4xl shadow-xl"
									:class="{
										'animate-bounce': selectedAnimation === 'bounce',
										'animate-pulse': selectedAnimation === 'pulse'
											|| selectedAnimation === 'glow',
									}"
								>
									<i class="i-mdi-shape" />
								</div>
							</div>

							<!-- Selected Animation Info -->
							<div
								v-if="selectedAnimation"
								class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl"
							>
								<h4 class="font-medium text-gray-900 dark:text-white">
									{{ animations.find(a => a.id === selectedAnimation)?.name }}
								</h4>
								<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
									{{
										animations.find(a => a.id === selectedAnimation)
										?.description
									}}
								</p>
								<div class="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-xs">
									{{
										animations.find(a => a.id === selectedAnimation)?.preview
									}}
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Settings -->
					<div class="w-72 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Animation Settings
						</h3>

						<div class="space-y-4">
							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Duration (seconds)</label>
								<input
									v-model.number="customDuration"
									type="range"
									min="0.1"
									max="5"
									step="0.1"
									class="w-full"
								/>
								<span class="text-sm text-gray-600 dark:text-gray-400">{{
										customDuration
									}}s</span>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Delay (seconds)</label>
								<input
									v-model.number="customDelay"
									type="range"
									min="0"
									max="3"
									step="0.1"
									class="w-full"
								/>
								<span class="text-sm text-gray-600 dark:text-gray-400">{{
										customDelay
									}}s</span>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Easing</label>
								<select
									v-model="customEasing"
									class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
								>
									<option v-for="ease in easings" :key="ease" :value="ease">
										{{ ease }}
									</option>
								</select>
							</div>

							<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
								<label class="flex items-center gap-2 mb-2">
									<input
										type="checkbox"
										class="rounded border-gray-300 text-blue-600"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300"
									>Loop animation</span>
								</label>
								<label class="flex items-center gap-2">
									<input
										type="checkbox"
										checked
										class="rounded border-gray-300 text-blue-600"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300"
									>Play on load</span>
								</label>
							</div>
						</div>

						<button
							v-if="selectedAnimation"
							class="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
							@click="applyAnimation(
								animations.find(a => a.id === selectedAnimation)!,
							)"
						>
							<i class="i-mdi-check mr-1" />
							Apply Animation
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
