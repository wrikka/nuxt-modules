<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "apply", settings: WhiteLabelSettings): void;
	(e: "close"): void;
}>();

interface WhiteLabelSettings {
	brandName: string;
	logo: string | null;
	primaryColor: string;
	secondaryColor: string;
	font: string;
	removeWatermark: boolean;
	customDomain: string;
}

const settings = ref<WhiteLabelSettings>({
	brandName: "",
	logo: null,
	primaryColor: "#3B82F6",
	secondaryColor: "#10B981",
	font: "Inter",
	removeWatermark: true,
	customDomain: "",
});

const fonts = ["Inter", "Roboto", "Poppins", "Montserrat", "Playfair Display"];
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						White-Label Template
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<div class="p-6 space-y-5">
					<!-- Brand Name -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Brand Name</label>
						<input
							v-model="settings.brandName"
							type="text"
							placeholder="Your company name"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						/>
					</div>

					<!-- Logo Upload -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Brand Logo</label>
						<div class="flex items-center gap-4">
							<div class="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
								<i
									v-if="!settings.logo"
									class="i-mdi-image text-gray-400 text-2xl"
								/>
								<img
									v-else
									:src="settings.logo"
									class="w-full h-full object-contain p-2"
								/>
							</div>
							<button class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
								Upload Logo
							</button>
						</div>
					</div>

					<!-- Colors -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>Primary Color</label>
							<div class="flex items-center gap-2">
								<input
									v-model="settings.primaryColor"
									type="color"
									class="w-10 h-10 rounded cursor-pointer"
								/>
								<input
									v-model="settings.primaryColor"
									type="text"
									class="flex-1 px-3 py-2 border rounded-lg text-sm"
								/>
							</div>
						</div>
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
							>Secondary Color</label>
							<div class="flex items-center gap-2">
								<input
									v-model="settings.secondaryColor"
									type="color"
									class="w-10 h-10 rounded cursor-pointer"
								/>
								<input
									v-model="settings.secondaryColor"
									type="text"
									class="flex-1 px-3 py-2 border rounded-lg text-sm"
								/>
							</div>
						</div>
					</div>

					<!-- Font -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Brand Font</label>
						<select
							v-model="settings.font"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						>
							<option v-for="font in fonts" :key="font" :value="font">
								{{ font }}
							</option>
						</select>
					</div>

					<!-- Options -->
					<div class="space-y-3">
						<label class="flex items-center gap-3">
							<input
								v-model="settings.removeWatermark"
								type="checkbox"
								class="w-4 h-4 rounded"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300"
							>Remove Media Studio watermark</span>
						</label>
					</div>

					<!-- Custom Domain -->
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>Custom Domain (Optional)</label>
						<div class="flex items-center gap-2">
							<span class="text-gray-500">https://</span>
							<input
								v-model="settings.customDomain"
								type="text"
								placeholder="templates.yourbrand.com"
								class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
							/>
						</div>
					</div>

					<!-- Preview -->
					<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
						<div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Preview
						</div>
						<div
							class="aspect-video rounded-lg overflow-hidden"
							:style="{ backgroundColor: settings.primaryColor }"
						>
							<div class="h-full flex flex-col items-center justify-center text-white p-4">
								<div
									class="text-2xl font-bold"
									:style="{ fontFamily: settings.font }"
								>
									{{ settings.brandName || "Your Brand" }}
								</div>
								<div
									class="mt-2 px-4 py-2 rounded"
									:style="{ backgroundColor: settings.secondaryColor }"
								>
									Template Preview
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
					<button
						:disabled="!settings.brandName"
						class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium"
						@click="$emit('apply', settings)"
					>
						Apply White-Label Settings
					</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>
