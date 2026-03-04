<script setup lang="ts">
import type { ColorCurves, ColorWheel, VideoClip } from "#shared/types";
import { useVideoEditor } from "~/composables/useVideoEditor";

const props = defineProps<{
	clipId: string;
}>();

const { currentVideoProject } = useVideoEditor();

const clip = computed(() => {
	if (!currentVideoProject.value) return null;
	return currentVideoProject.value.clips.find((c: VideoClip) =>
		c.id === props.clipId
	) || null;
});

const defaultWheel = (): ColorWheel => ({ hue: 0, saturation: 0, value: 0 });

const defaultCurves = (): ColorCurves => ({
	rgb: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
	red: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
	green: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
	blue: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
	luma: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
});

const colorGrading = computed({
	get: () =>
		clip.value?.colorGrading ?? {
			enabled: false,
			wheels: {
				shadows: defaultWheel(),
				midtones: defaultWheel(),
				highlights: defaultWheel(),
			},
			curves: defaultCurves(),
			temperature: 0,
			tint: 0,
			vibrance: 0,
		},
	set: (value) => {
		if (clip.value) {
			clip.value.colorGrading = value;
		}
	},
});

const activeTab = ref<"wheels" | "curves">("wheels");
const activeCurve = ref<keyof ColorCurves>("rgb");

const currentCurvePoints = computed(() =>
	colorGrading.value.curves[activeCurve.value]
);

const curveColors: Record<keyof ColorCurves, string> = {
	rgb: "#ffffff",
	red: "#ef4444",
	green: "#22c55e",
	blue: "#3b82f6",
	luma: "#a1a1aa",
};

const wheelColors: Record<string, string> = {
	shadows: "#4b5563",
	midtones: "#9ca3af",
	highlights: "#f3f4f6",
};

const updateWheel = (
	zone: "shadows" | "midtones" | "highlights",
	key: keyof ColorWheel,
	value: number,
) => {
	if (!colorGrading.value) return;
	colorGrading.value.wheels[zone][key] = value;
};
</script>

<template>
	<div class="border-t border-gray-700 pt-4 mt-4">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-white font-medium">Advanced Color Grading</h3>
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					v-model="colorGrading.enabled"
					type="checkbox"
					class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-amber-600 focus:ring-amber-500"
				>
				<span class="text-gray-400 text-xs">Enable</span>
			</label>
		</div>

		<div v-if="colorGrading.enabled" class="space-y-4">
			<!-- Tabs -->
			<div class="flex rounded-lg bg-gray-800 p-1">
				<button
					class="flex-1 px-3 py-1.5 text-xs rounded-md transition-colors"
					:class="activeTab === 'wheels'
					? 'bg-amber-600 text-white'
					: 'text-gray-400 hover:text-white'"
					@click="activeTab = 'wheels'"
				>
					Color Wheels
				</button>
				<button
					class="flex-1 px-3 py-1.5 text-xs rounded-md transition-colors"
					:class="activeTab === 'curves'
					? 'bg-amber-600 text-white'
					: 'text-gray-400 hover:text-white'"
					@click="activeTab = 'curves'"
				>
					Curves
				</button>
			</div>

			<!-- Color Wheels -->
			<div v-if="activeTab === 'wheels'" class="space-y-4">
				<div
					v-for="(wheel, zone) in colorGrading.wheels"
					:key="zone"
					class="p-3 rounded-lg bg-gray-800"
				>
					<div class="flex items-center gap-2 mb-3">
						<div
							class="w-4 h-4 rounded-full"
							:style="{ backgroundColor: wheelColors[zone] }"
						/>
						<span class="text-white text-sm capitalize">{{ zone }}</span>
					</div>

					<div class="grid grid-cols-3 gap-2">
						<div>
							<label class="text-gray-500 text-[10px] mb-1 block">Hue</label>
							<input
								v-model.number="colorGrading.wheels[zone].hue"
								type="number"
								min="-180"
								max="180"
								class="w-full bg-gray-900 text-amber-400 text-xs rounded px-2 py-1"
								@input="updateWheel(
									zone,
									'hue',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div>
							<label class="text-gray-500 text-[10px] mb-1 block">Sat</label>
							<input
								v-model.number="colorGrading.wheels[zone].saturation"
								type="number"
								min="-100"
								max="100"
								class="w-full bg-gray-900 text-amber-400 text-xs rounded px-2 py-1"
								@input="updateWheel(
									zone,
									'saturation',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div>
							<label class="text-gray-500 text-[10px] mb-1 block">Val</label>
							<input
								v-model.number="colorGrading.wheels[zone].value"
								type="number"
								min="-100"
								max="100"
								class="w-full bg-gray-900 text-amber-400 text-xs rounded px-2 py-1"
								@input="updateWheel(
									zone,
									'value',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<!-- Visual Wheel Representation -->
					<div class="mt-3 h-24 rounded-lg bg-gray-900 flex items-center justify-center relative overflow-hidden">
						<div
							class="w-20 h-20 rounded-full border-2 border-gray-600 relative"
							:style="{
								background: `conic-gradient(from ${
									colorGrading.wheels[zone].hue
								}deg, 
                  hsl(${colorGrading.wheels[zone].hue}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue + 60}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue + 120}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue + 180}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue + 240}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue + 300}, 100%, 50%), 
                  hsl(${colorGrading.wheels[zone].hue}, 100%, 50%))`,
								opacity: 0.3
									+ (colorGrading.wheels[zone].saturation + 100) / 200 * 0.7,
								filter: `brightness(${
									1 + colorGrading.wheels[zone].value / 200
								})`,
							}"
						>
							<div
								class="absolute w-3 h-3 bg-white rounded-full border-2 border-gray-400"
								:style="{
									left: '50%',
									top: '50%',
									transform: `translate(-50%, -50%) rotate(${
										colorGrading.wheels[zone].hue
									}deg) translateY(-30px)`,
								}"
							/>
						</div>
					</div>
				</div>

				<!-- Temperature & Tint -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Temperature</label>
							<span class="text-amber-400 text-xs">{{
								colorGrading.temperature
							}}</span>
						</div>
						<input
							v-model.number="colorGrading.temperature"
							type="range"
							min="-100"
							max="100"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
						>
					</div>
					<div>
						<div class="flex items-center justify-between mb-1">
							<label class="text-gray-400 text-xs">Tint</label>
							<span class="text-amber-400 text-xs">{{
								colorGrading.tint
							}}</span>
						</div>
						<input
							v-model.number="colorGrading.tint"
							type="range"
							min="-100"
							max="100"
							class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
						>
					</div>
				</div>

				<!-- Vibrance -->
				<div>
					<div class="flex items-center justify-between mb-1">
						<label class="text-gray-400 text-xs">Vibrance</label>
						<span class="text-amber-400 text-xs">{{
							colorGrading.vibrance
						}}</span>
					</div>
					<input
						v-model.number="colorGrading.vibrance"
						type="range"
						min="-100"
						max="100"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
					>
				</div>
			</div>

			<!-- Curves -->
			<div v-else class="space-y-4">
				<!-- Curve Channel Selector -->
				<div class="flex gap-1">
					<button
						v-for="(color, channel) in curveColors"
						:key="channel"
						class="flex-1 px-2 py-1.5 text-xs rounded transition-colors capitalize"
						:class="activeCurve === channel
						? 'bg-gray-700 text-white'
						: 'text-gray-500 hover:text-gray-300'"
						@click="activeCurve = channel"
					>
						<span
							class="inline-block w-2 h-2 rounded-full mr-1"
							:style="{ backgroundColor: color }"
						/>
						{{ channel }}
					</button>
				</div>

				<!-- Curves Canvas -->
				<div class="h-48 rounded-lg bg-gray-800 relative overflow-hidden">
					<svg class="w-full h-full" viewBox="0 0 255 255">
						<!-- Grid -->
						<defs>
							<pattern
								id="grid"
								width="32"
								height="32"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 32 0 L 0 0 0 32"
									fill="none"
									stroke="#374151"
									stroke-width="0.5"
								/>
							</pattern>
						</defs>
						<rect width="255" height="255" fill="url(#grid)" />

						<!-- Diagonal Line -->
						<line
							x1="0"
							y1="255"
							x2="255"
							y2="0"
							stroke="#4b5563"
							stroke-width="1"
							stroke-dasharray="4"
						/>

						<!-- Curve -->
						<path
							:d="`M 0 ${255 - (currentCurvePoints[0]?.y ?? 0)} `
							+ currentCurvePoints.slice(1).map((
								p: { x: number; y: number },
							) => `L ${p.x} ${255 - p.y}`).join(' ')"
							fill="none"
							:stroke="curveColors[activeCurve]"
							stroke-width="2"
						/>

						<!-- Control Points -->
						<circle
							v-for="(point, i) in currentCurvePoints"
							:key="i"
							:cx="point.x"
							:cy="255 - point.y"
							r="6"
							fill="#1f2937"
							:stroke="curveColors[activeCurve]"
							stroke-width="2"
							class="cursor-move"
						/>
					</svg>

					<!-- Labels -->
					<div class="absolute bottom-2 left-2 text-[10px] text-gray-500">
						Shadows
					</div>
					<div class="absolute bottom-2 right-2 text-[10px] text-gray-500">
						Highlights
					</div>
					<div class="absolute top-2 left-2 text-[10px] text-gray-500">
						Output
					</div>
				</div>

				<!-- Preset Curves -->
				<div class="grid grid-cols-4 gap-2">
					<button
						class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
						@click="colorGrading.curves = defaultCurves()"
					>
						Linear
					</button>
					<button
						class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
						@click="colorGrading.curves.rgb = [{ x: 0, y: 32 }, { x: 128, y: 128 }, {
							x: 255,
							y: 240,
						}]"
					>
						S-Curve
					</button>
					<button
						class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
						@click="colorGrading.curves.rgb = [{ x: 0, y: 64 }, { x: 128, y: 128 }, {
							x: 255,
							y: 200,
						}]"
					>
						Contrast
					</button>
					<button
						class="p-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
						@click="colorGrading.curves.luma = [{ x: 0, y: 0 }, { x: 64, y: 32 }, {
							x: 192,
							y: 224,
						}, { x: 255, y: 255 }]"
					>
						Film
					</button>
				</div>
			</div>

			<!-- Reset Button -->
			<button
				class="w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded flex items-center justify-center gap-2 transition-colors"
				@click="colorGrading = {
					enabled: true,
					wheels: {
						shadows: defaultWheel(),
						midtones: defaultWheel(),
						highlights: defaultWheel(),
					},
					curves: defaultCurves(),
					temperature: 0,
					tint: 0,
					vibrance: 0,
				}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
				</svg>
				Reset All
			</button>
		</div>
	</div>
</template>
