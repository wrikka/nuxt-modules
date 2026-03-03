<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "restore", version: BackupVersion): void;
}>();

interface BackupVersion {
	id: string;
	name: string;
	date: Date;
	size: string;
	author: string;
	changes: string[];
	isAuto: boolean;
}

const backups = ref<BackupVersion[]>([
	{
		id: "current",
		name: "Current Version",
		date: new Date(),
		size: "2.4 MB",
		author: "You",
		changes: ["Added hero image", "Updated color scheme"],
		isAuto: false,
	},
	{
		id: "backup-1",
		name: "Backup #1",
		date: new Date(Date.now() - 24 * 60 * 60 * 1000),
		size: "2.1 MB",
		author: "System",
		changes: ["Initial template creation"],
		isAuto: true,
	},
	{
		id: "backup-2",
		name: "Backup #2",
		date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
		size: "1.8 MB",
		author: "System",
		changes: ["Layout adjustments", "Font changes"],
		isAuto: true,
	},
]);

const autoBackupEnabled = ref(true);
const backupFrequency = ref("daily");
const keepCount = ref(10);
const isCreating = ref(false);
const showRestoreConfirm = ref<string | null>(null);

const createBackup = async () => {
	isCreating.value = true;
	await new Promise(r => setTimeout(r, 1000));

	const newBackup: BackupVersion = {
		id: `backup-${Date.now()}`,
		name: `Backup #${backups.value.length}`,
		date: new Date(),
		size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
		author: "You",
		changes: ["Manual backup created"],
		isAuto: false,
	};

	backups.value.unshift(newBackup);
	isCreating.value = false;
};

const restoreBackup = (backup: BackupVersion) => {
	emit("restore", backup);
	showRestoreConfirm.value = null;
};

const deleteBackup = (id: string) => {
	const index = backups.value.findIndex(b => b.id === id);
	if (index > -1 && backups.value[index]!.id !== "current") {
		backups.value.splice(index, 1);
	}
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-backup-restore text-cyan-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Backup & Restore
							</h2>
							<p class="text-sm text-gray-500">
								Manage template versions and backups
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
							:disabled="isCreating"
							@click="createBackup"
						>
							<i class="i-mdi-plus" :class="isCreating ? 'animate-spin' : ''" />
							{{ isCreating ? "Creating..." : "Create Backup" }}
						</button>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Backup List -->
					<div class="flex-1 overflow-y-auto p-6">
						<div class="max-w-3xl mx-auto space-y-4">
							<div
								v-for="backup in backups"
								:key="backup.id"
								class="p-4 border rounded-xl transition-colors"
								:class="backup.id === 'current'
								? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
							>
								<div class="flex items-start justify-between">
									<div class="flex items-start gap-3">
										<div
											class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
											:class="backup.isAuto
											? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
											: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'"
										>
											<i
												:class="backup.isAuto ? 'i-mdi-robot' : 'i-mdi-account'"
											/>
										</div>
										<div>
											<div class="flex items-center gap-2">
												<h4 class="font-medium text-gray-900 dark:text-white">
													{{ backup.name }}
												</h4>
												<span
													v-if="backup.id === 'current'"
													class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
												>
													Current
												</span>
												<span
													v-if="backup.isAuto"
													class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full"
												>
													Auto
												</span>
											</div>
											<p class="text-sm text-gray-500">
												{{ formatDate(backup.date) }} • {{ backup.size }} • by
												{{ backup.author }}
											</p>
											<div class="flex flex-wrap gap-1 mt-2">
												<span
													v-for="change in backup.changes"
													:key="change"
													class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
												>
													{{ change }}
												</span>
											</div>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<button
											v-if="backup.id !== 'current'"
											class="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
											@click="showRestoreConfirm = backup.id"
										>
											Restore
										</button>
										<button
											v-if="backup.id !== 'current'"
											class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
											@click="deleteBackup(backup.id)"
										>
											<i class="i-mdi-delete" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Settings -->
					<div class="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<h3 class="font-medium text-gray-900 dark:text-white mb-4">
							Auto-Backup Settings
						</h3>

						<div class="space-y-4">
							<label class="flex items-center justify-between">
								<span class="text-sm text-gray-700 dark:text-gray-300"
								>Enable Auto-Backup</span>
								<input
									v-model="autoBackupEnabled"
									type="checkbox"
									class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
							</label>

							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Frequency</label>
								<select
									v-model="backupFrequency"
									class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
									:disabled="!autoBackupEnabled"
								>
									<option value="hourly">Every hour</option>
									<option value="daily">Daily</option>
									<option value="weekly">Weekly</option>
									<option value="on_save">On every save</option>
								</select>
							</div>

							<div>
								<label
									class="text-xs text-gray-500 uppercase tracking-wide mb-1 block"
								>Keep Last</label>
								<input
									v-model.number="keepCount"
									type="number"
									min="1"
									max="100"
									class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
									:disabled="!autoBackupEnabled"
								/>
								<p class="text-xs text-gray-500 mt-1">
									backups (older ones auto-deleted)
								</p>
							</div>
						</div>

						<div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
							<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
								Storage Usage
							</h4>
							<div class="flex items-center gap-3">
								<div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div class="w-3/4 h-full bg-blue-600 rounded-full" />
								</div>
								<span class="text-sm text-gray-600">75%</span>
							</div>
							<p class="text-xs text-gray-500 mt-2">
								7.2 GB of 10 GB used
							</p>
						</div>
					</div>
				</div>

				<!-- Restore Confirmation Modal -->
				<Transition name="fade">
					<div
						v-if="showRestoreConfirm"
						class="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
					>
						<div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
							<div class="flex items-center gap-3 mb-4">
								<div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
									<i class="i-mdi-alert text-yellow-600 text-xl" />
								</div>
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-white">
										Restore Backup?
									</h3>
									<p class="text-sm text-gray-500">
										This will replace your current template
									</p>
								</div>
							</div>
							<p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
								Your current version will be saved as a backup. Are you sure you
								want to continue?
							</p>
							<div class="flex gap-3">
								<button
									class="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
									@click="showRestoreConfirm = null"
								>
									Cancel
								</button>
								<button
									class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
									@click="restoreBackup(
										backups.find(b => b.id === showRestoreConfirm)!,
									)"
								>
									Restore
								</button>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
