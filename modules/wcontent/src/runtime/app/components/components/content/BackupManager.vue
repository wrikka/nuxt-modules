<script setup lang="ts">
import { onMounted, ref } from "vue";
import type {
	BackupList,
	ContentBackup,
} from "../../../../shared/types/backup";
import { useBackup } from "../../../composables/useBackup";

const props = defineProps<{
	contentPath: string;
}>();

const { createBackup, restoreBackup, getBackupList, deleteBackup } =
	useBackup();

const backups = ref<BackupList | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadBackups() {
	loading.value = true;
	error.value = null;
	try {
		backups.value = await getBackupList(props.contentPath);
	} catch (e: any) {
		error.value = e.message || "Failed to load backups";
	} finally {
		loading.value = false;
	}
}

async function handleCreateBackup() {
	loading.value = true;
	error.value = null;
	try {
		await createBackup(props.contentPath, "", {});
		await loadBackups();
	} catch (e: any) {
		error.value = e.message || "Failed to create backup";
	} finally {
		loading.value = false;
	}
}

async function handleRestore(backup: ContentBackup) {
	if (!confirm(`Are you sure you want to restore from backup ${backup.id}?`)) {
		return;
	}

	loading.value = true;
	error.value = null;
	try {
		await restoreBackup(props.contentPath, backup.id);
	} catch (e: any) {
		error.value = e.message || "Failed to restore backup";
	} finally {
		loading.value = false;
	}
}

async function handleDelete(backup: ContentBackup) {
	if (!confirm(`Are you sure you want to delete backup ${backup.id}?`)) return;

	loading.value = true;
	error.value = null;
	try {
		await deleteBackup(props.contentPath, backup.id);
		await loadBackups();
	} catch (e: any) {
		error.value = e.message || "Failed to delete backup";
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	loadBackups();
});
</script>

<template>
	<div class="backup-manager">
		<div class="backup-manager-header">
			<h3>Backup Manager</h3>
			<button
				v-if="!loading"
				class="create-btn"
				@click="handleCreateBackup"
			>
				Create Backup
			</button>
		</div>

		<div
			v-if="loading"
			class="loading"
		>
			Loading...
		</div>

		<div
			v-else-if="error"
			class="error"
		>
			{{ error }}
		</div>

		<div
			v-else-if="backups && backups.backups.length === 0"
			class="empty"
		>
			No backups found
		</div>

		<div
			v-else-if="backups"
			class="backup-list"
		>
			<div
				v-for="backup in backups.backups"
				:key="backup.id"
				class="backup-item"
			>
				<div class="backup-info">
					<span class="backup-date">{{
						new Date(backup.createdAtISO).toLocaleString()
					}}</span>
					<span class="backup-size">{{ (backup.size / 1024).toFixed(2) }}
						KB</span>
				</div>
				<div class="backup-actions">
					<button
						class="restore-btn"
						@click="handleRestore(backup)"
					>
						Restore
					</button>
					<button
						class="delete-btn"
						@click="handleDelete(backup)"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.backup-manager {
	padding: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

.backup-manager-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.backup-manager-header h3 {
	margin: 0;
}

.create-btn {
	padding: 0.25rem 0.5rem;
	background: #3b82f6;
	color: white;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
}

.loading,
.error,
.empty {
	text-align: center;
	padding: 1rem;
}

.error {
	color: #ef4444;
}

.backup-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.backup-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.75rem;
	background: #f9fafb;
	border-radius: 0.25rem;
}

.backup-info {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.backup-date {
	font-size: 0.875rem;
	color: #6b7280;
}

.backup-size {
	font-size: 0.875rem;
	color: #6b7280;
}

.backup-actions {
	display: flex;
	gap: 0.5rem;
}

.restore-btn {
	padding: 0.25rem 0.5rem;
	background: #10b981;
	color: white;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
}

.delete-btn {
	padding: 0.25rem 0.5rem;
	background: #ef4444;
	color: white;
	border: none;
	border-radius: 0.25rem;
	cursor: pointer;
}
</style>
