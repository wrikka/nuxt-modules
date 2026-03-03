<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const position = defineModel<
	"bottom-right" | "bottom-left" | "top-right" | "top-left"
>("position", { default: "bottom-right" });
const size = defineModel<"small" | "medium" | "large">("size", {
	default: "medium",
});
const mirror = defineModel<boolean>("mirror", { default: false });
const interpreterName = defineModel<string>("interpreterName", { default: "" });
const showCertification = defineModel<boolean>("showCertification", {
	default: true,
});

const sizeOptions = {
	small: { width: 160, height: 120 },
	medium: { width: 240, height: 180 },
	large: { width: 320, height: 240 },
};

const certifications = [
	{ code: "RID", name: "Registry of Interpreters for the Deaf" },
	{ code: "NAD", name: "National Association of the Deaf" },
	{ code: "EASI", name: "Educational Interpreter" },
	{ code: "CI", name: "Certified Interpreter" },
];

const selectedCert = ref("RID");
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
					<Icon
						name="mdi:sign-language"
						class="w-5 h-5 text-pink-600 dark:text-pink-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Sign Language Window
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Dedicated interpreter overlay
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-pink-600 mt-0.5" />
					<p class="text-xs text-pink-700 dark:text-pink-300">
						Creates a dedicated area for sign language interpreters during
						recordings. Essential for accessibility compliance and inclusive
						content.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Window Position</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for='pos in ["bottom-right", "bottom-left", "top-right", "top-left"] as const'
						:key="pos"
						:class="[
							'p-2 rounded-lg border text-center transition-all text-sm',
							position === pos
								? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-pink-300',
						]"
						@click="position = pos"
					>
						{{ pos.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase()) }}
					</button>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Window Size</label>
				<div class="flex gap-2">
					<button
						v-for='s in ["small", "medium", "large"] as const'
						:key="s"
						:class="[
							'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize',
							size === s
								? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-pink-300',
						]"
						@click="size = s"
					>
						{{ s }}
					</button>
				</div>
				<p class="text-xs text-gray-500 mt-1">
					{{ sizeOptions[size].width }}x{{ sizeOptions[size].height }} pixels
				</p>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
				>Interpreter Name</label>
				<input
					v-model="interpreterName"
					type="text"
					placeholder="Enter interpreter name..."
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="showCertification"
					type="checkbox"
					class="w-4 h-4 text-pink-600 rounded"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Show certification badge</span>
			</div>

			<div v-if="showCertification" class="pl-6">
				<select
					v-model="selectedCert"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
					<option
						v-for="cert in certifications"
						:key="cert.code"
						:value="cert.code"
					>
						{{ cert.code }} - {{ cert.name }}
					</option>
				</select>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="mirror"
					type="checkbox"
					class="w-4 h-4 text-pink-600 rounded"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Mirror interpreter video</span>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Preview
				</h4>
				<div class="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<Icon name="mdi:video" class="w-12 h-12 text-gray-700" />
					</div>
					<div
						:class="`absolute ${position.includes('bottom') ? 'bottom-4' : 'top-4'} ${
							position.includes('right') ? 'right-4' : 'left-4'
						} bg-black/80 rounded-lg overflow-hidden border-2 border-pink-500`"
						:style="{
							width: `${sizeOptions[size].width / 4}px`,
							height: `${sizeOptions[size].height / 4}px`,
						}"
					>
						<div class="w-full h-full flex items-center justify-center">
							<Icon name="mdi:account" class="w-8 h-8 text-gray-400" />
						</div>
						<div
							v-if="interpreterName || showCertification"
							class="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5"
						>
							<div
								v-if="interpreterName"
								class="text-[8px] text-white truncate"
							>
								{{ interpreterName }}
							</div>
							<div v-if="showCertification" class="text-[6px] text-pink-400">
								{{ selectedCert }} Certified
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
