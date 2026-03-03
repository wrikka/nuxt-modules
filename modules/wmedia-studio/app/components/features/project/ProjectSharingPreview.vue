<script setup lang="ts">
const isOpen = ref(false);
const shareType = ref<"link" | "embed" | "social">("link");
const permissions = ref("view");
const allowComments = ref(true);
const requirePassword = ref(false);
const password = ref("");

const previewDevices = [
	{ id: "desktop", name: "Desktop", width: "100%", icon: "💻" },
	{ id: "tablet", name: "Tablet", width: "768px", icon: "📱" },
	{ id: "mobile", name: "Mobile", width: "375px", icon: "📲" },
];
const selectedDevice = ref("desktop");

const shareLink = ref("https://mediastudio.app/s/x7k9m2p");

const copyLink = () => {
	navigator.clipboard.writeText(shareLink.value);
	alert("Link copied to clipboard!");
};

const generatePreview = () => {
	alert("Generating preview...");
};
</script>

<template>
	<div class="relative">
		<!-- Share Button -->
		<button
			class="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
			@click="isOpen = true"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
				/>
			</svg>
			<span class="text-sm font-medium">Share Preview</span>
		</button>

		<!-- Share Modal -->
		<Transition>
			<div
				v-if="isOpen"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
				@click.self="isOpen = false"
			>
				<div class="w-[900px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
					<!-- Header -->
					<div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<svg
								class="w-5 h-5 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							<h3 class="font-semibold text-gray-900 dark:text-white">
								Sharing Preview
							</h3>
						</div>
						<button
							class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
							@click="isOpen = false"
						>
							<svg
								class="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<!-- Content -->
					<div class="flex flex-1 overflow-hidden">
						<!-- Left Panel - Settings -->
						<div class="w-80 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
							<!-- Share Type -->
							<div class="mb-6">
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>Share as</label>
								<div class="flex gap-2">
									<button
										v-for='type in ["link", "embed", "social"]'
										:key="type"
										:class="[
											'flex-1 py-2 text-sm rounded-lg transition-colors capitalize',
											shareType === type
												? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
												: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
										]"
										@click="shareType = type as any"
									>
										{{ type }}
									</button>
								</div>
							</div>

							<!-- Permissions -->
							<div class="mb-6">
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>Permissions</label>
								<select
									v-model="permissions"
									class="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
								>
									<option value="view">Can view only</option>
									<option value="comment">Can comment</option>
									<option value="edit">Can edit</option>
								</select>
							</div>

							<!-- Options -->
							<div class="space-y-3 mb-6">
								<label class="flex items-center gap-2 cursor-pointer">
									<input
										v-model="allowComments"
										type="checkbox"
										class="rounded text-green-600"
									>
									<span class="text-sm">Allow comments</span>
								</label>
								<label class="flex items-center gap-2 cursor-pointer">
									<input
										v-model="requirePassword"
										type="checkbox"
										class="rounded text-green-600"
									>
									<span class="text-sm">Require password</span>
								</label>
								<input
									v-if="requirePassword"
									v-model="password"
									type="password"
									placeholder="Set password"
									class="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm mt-2"
								/>
							</div>

							<!-- Share Link -->
							<div v-if="shareType === 'link'">
								<label
									class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
								>Share Link</label>
								<div class="flex gap-2">
									<input
										:value="shareLink"
										readonly
										class="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
									/>
									<button
										class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
										@click="copyLink"
									>
										Copy
									</button>
								</div>
							</div>
						</div>

						<!-- Right Panel - Preview -->
						<div class="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
							<!-- Device Switcher -->
							<div class="flex justify-center gap-2 mb-4">
								<button
									v-for="device in previewDevices"
									:key="device.id"
									:class="[
										'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors',
										selectedDevice === device.id
											? 'bg-white dark:bg-gray-800 shadow'
											: 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-800/50',
									]"
									@click="selectedDevice = device.id"
								>
									<span>{{ device.icon }}</span>
									<span>{{ device.name }}</span>
								</button>
							</div>

							<!-- Preview Canvas -->
							<div class="flex justify-center">
								<div
									class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
									:style="{
										width: previewDevices.find(d => d.id === selectedDevice)
											?.width,
									}"
								>
									<!-- Mock Content -->
									<div class="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
										<div class="text-center">
											<div class="text-6xl mb-4">🎨</div>
											<p class="text-gray-600 dark:text-gray-400">
												Your Design Preview
											</p>
											<p class="text-sm text-gray-400 mt-2">
												This is how others will see your project
											</p>
										</div>
									</div>

									<!-- Footer Info -->
									<div class="p-4 border-t border-gray-200 dark:border-gray-700">
										<div class="flex items-center justify-between text-sm text-gray-500">
											<span>Shared by You</span>
											<span>Just now</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Info Banner -->
							<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
								<p class="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									This preview shows exactly what others will see when you share
									this project.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
