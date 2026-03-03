<script setup lang="ts">
import { onMounted, ref } from "vue";
import type {
	ContentVersion,
	VersionHistory,
} from "../../../../shared/types/version-control";
import { useVersionControl } from "../../../composables/useVersionControl";

const props = defineProps<{
	contentPath: string;
}>();

const { getVersionHistory, rollback } = useVersionControl();

const history = ref<VersionHistory | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadHistory() {
	loading.value = true;
	error.value = null;
	try {
		history.value = await getVersionHistory(props.contentPath);
	} catch (e: any) {
		error.value = e.message || "Failed to load version history";
	} finally {
		loading.value = false;
	}
}

async function handleRollback(versionNumber: number) {
	if (
		!confirm(`Are you sure you want to rollback to version ${versionNumber}?`)
	) return;

	loading.value = true;
	error.value = null;
	try {
		await rollback(props.contentPath, versionNumber);
		await loadHistory();
	} catch (e: any) {
		error.value = e.message || "Failed to rollback";
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	loadHistory();
});
</script>

<template>
	<div class="version-history">
		<div class="version-history-header">
			<h3>Version History</h3>
			<button
				v-if="!loading"
				class="refresh-btn"
				@click="loadHistory"
			>
				Refresh
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
			v-else-if="history && history.versions.length === 0"
			class="empty"
		>
			No versions found
		</div>

		<div
			v-else-if="history"
			class="version-list"
		>
			<div
				v-for="version in history.versions"
				:key="version.id"
				class="version-item"
				:class="{ current: version.isCurrent }"
			>
				<div class="version-info">
					<span class="version-number">v{{ version.version }}</span>
					<span class="version-date">{{
						new Date(version.createdAtISO).toLocaleString()
					}}</span>
					<span class="version-author">{{ version.authorName }}</span>
					<span
						v-if="version.changeDescription"
						class="version-description"
					>
						{{ version.changeDescription }}
					</span>
				</div>
				<button
					v-if="!version.isCurrent"
					class="rollback-btn"
					@click="handleRollback(version.version)"
				>
					Rollback
				</button>
				<span
					v-else
					class="current-badge"
				>
					Current
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.version-history {
	padding: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
}

.version-history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
}

.version-history-header h3 {
	margin: 0;
}

.refresh-btn {
	padding: 0.25rem 0.5rem;
	background: #f3f4f6;
	border: 1px solid #d1d5db;
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

.version-list {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.version-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.75rem;
	background: #f9fafb;
	border-radius: 0.25rem;
}

.version-item.current {
	background: #dbeafe;
	border: 1px solid #3b82f6;
}

.version-info {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}

.version-number {
	font-weight: 600;
	color: #1f2937;
}

.version-date {
	font-size: 0.875rem;
	color: #6b7280;
}

.version-author {
	font-size: 0.875rem;
	color: #6b7280;
}

.version-description {
	font-size: 0.875rem;
	color: #374151;
}

.rollback-btn {
	padding: 0.25rem 0.5rem;
	background: #fef2f2;
	border: 1px solid #fecaca;
	color: #dc2626;
	border-radius: 0.25rem;
	cursor: pointer;
}

.rollback-btn:hover {
	background: #fee2e2;
}

.current-badge {
	padding: 0.25rem 0.5rem;
	background: #3b82f6;
	color: white;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}
</style>
