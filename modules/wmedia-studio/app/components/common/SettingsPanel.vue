<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const sections = [
	{ id: "general", name: "General", icon: "mdi:cog" },
	{ id: "appearance", name: "Appearance", icon: "mdi:palette" },
	{ id: "editor", name: "Editor", icon: "mdi:pencil" },
	{ id: "export", name: "Export", icon: "mdi:download" },
	{ id: "shortcuts", name: "Shortcuts", icon: "mdi:keyboard" },
	{ id: "account", name: "Account", icon: "mdi:account" },
];

const activeSection = ref("general");
const darkMode = ref(true);
const autoSave = ref(true);
const showGrid = ref(true);
const snapToGrid = ref(true);
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl h-[80vh] shadow-2xl flex overflow-hidden">
			<!-- Sidebar -->
			<div class="w-56 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
				<h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
					Settings
				</h2>
				<nav class="space-y-1">
					<button
						v-for="section in sections"
						:key="section.id"
						@click="activeSection = section.id"
						:class="[
							'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
							activeSection === section.id
								? 'bg-blue-500 text-white'
								: 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800',
						]"
					>
						<Icon :name="section.icon" class="w-4 h-4" />
						{{ section.name }}
					</button>
				</nav>
			</div>

			<!-- Content -->
			<div class="flex-1 p-6 overflow-y-auto">
				<!-- General -->
				<div v-if="activeSection === 'general'" class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						General Settings
					</h3>
					<div class="space-y-3">
						<label
							class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
						>
							<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>Auto-save</span>
							<button
								@click="autoSave = !autoSave"
								:class="[
									'w-12 h-6 rounded-full transition-colors',
									autoSave ? 'bg-blue-500' : 'bg-gray-300',
								]"
							>
								<div
									:class="[
										'w-5 h-5 bg-white rounded-full transition-all',
										autoSave ? 'translate-x-6' : 'translate-x-1',
									]"
								/>
							</button>
						</label>
						<label
							class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
						>
							<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>Show grid</span>
							<button
								@click="showGrid = !showGrid"
								:class="[
									'w-12 h-6 rounded-full transition-colors',
									showGrid ? 'bg-blue-500' : 'bg-gray-300',
								]"
							>
								<div
									:class="[
										'w-5 h-5 bg-white rounded-full transition-all',
										showGrid ? 'translate-x-6' : 'translate-x-1',
									]"
								/>
							</button>
						</label>
						<label
							class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
						>
							<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>Snap to grid</span>
							<button
								@click="snapToGrid = !snapToGrid"
								:class="[
									'w-12 h-6 rounded-full transition-colors',
									snapToGrid ? 'bg-blue-500' : 'bg-gray-300',
								]"
							>
								<div
									:class="[
										'w-5 h-5 bg-white rounded-full transition-all',
										snapToGrid ? 'translate-x-6' : 'translate-x-1',
									]"
								/>
							</button>
						</label>
					</div>
				</div>

				<!-- Appearance -->
				<div v-if="activeSection === 'appearance'" class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						Appearance
					</h3>
					<div class="grid grid-cols-2 gap-3">
						<button
							@click="darkMode = false"
							:class="[
								'p-4 border-2 rounded-xl text-center',
								!darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
							]"
						>
							<Icon
								name="mdi:white-balance-sunny"
								class="w-8 h-8 mx-auto mb-2 text-yellow-500"
							/>
							<span class="text-sm font-medium">Light</span>
						</button>
						<button
							@click="darkMode = true"
							:class="[
								'p-4 border-2 rounded-xl text-center',
								darkMode
									? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
									: 'border-gray-200',
							]"
						>
							<Icon
								name="mdi:moon-waning-crescent"
								class="w-8 h-8 mx-auto mb-2 text-blue-500"
							/>
							<span class="text-sm font-medium">Dark</span>
						</button>
					</div>
				</div>

				<!-- Other sections placeholder -->
				<div v-else class="text-center py-12 text-gray-500">
					<Icon
						:name="sections.find(s => s.id === activeSection)?.icon || 'mdi:cog'"
						class="w-12 h-12 mx-auto mb-3 block opacity-50"
					/>
					<p>
						{{ sections.find(s => s.id === activeSection)?.name }} settings
						coming soon
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
