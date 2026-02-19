<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type {
	ContentVersion,
	VersionHistory,
} from "../../../../shared/types/version-control";
import { useVersionControl } from "../../../composables/useVersionControl";

const props = defineProps<{
	contentPath: string;
}>();

const emit = defineEmits<{
	restore: [version: ContentVersion];
	compare: [versionA: ContentVersion, versionB: ContentVersion];
}>();

const { getVersionHistory, rollback } = useVersionControl();

const history = ref<VersionHistory | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedVersions = ref<string[]>([]);
const showDiff = ref(false);
const diffContent = ref<
	{ added: string[]; removed: string[]; modified: string[] } | null
>(null);

const sortedVersions = computed(() => {
	if (!history.value) return [];
	return [...history.value.versions].sort((a, b) => b.version - a.version);
});

const formatDate = (isoString: string) => {
	return new Date(isoString).toLocaleDateString("th-TH", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const loadHistory = async () => {
	loading.value = true;
	error.value = null;
	try {
		history.value = await getVersionHistory(props.contentPath);
	} catch (e: any) {
		error.value = e.message || "Failed to load version history";
	} finally {
		loading.value = false;
	}
};

const handleRestore = async (version: ContentVersion) => {
	if (!confirm(`Restore to version ${version.version}?`)) return;

	loading.value = true;
	try {
		await rollback(props.contentPath, version.version);
		await loadHistory();
		emit("restore", version);
	} catch (e: any) {
		error.value = e.message || "Failed to restore version";
	} finally {
		loading.value = false;
	}
};

const toggleVersionSelect = (versionId: string) => {
	const index = selectedVersions.value.indexOf(versionId);
	if (index > -1) {
		selectedVersions.value.splice(index, 1);
	} else if (selectedVersions.value.length < 2) {
		selectedVersions.value.push(versionId);
	}
};

const compareVersions = () => {
	if (selectedVersions.value.length !== 2) return;

	const v1 = history.value?.versions.find((v) =>
		v.id === selectedVersions.value[0]
	);
	const v2 = history.value?.versions.find((v) =>
		v.id === selectedVersions.value[1]
	);

	if (v1 && v2) {
		emit("compare", v1, v2);
		showDiff.value = true;
	}
};

const getVersionBadgeClass = (version: ContentVersion) => {
	if (version.isCurrent) return "badge-current";
	return "badge-default";
};

onMounted(() => {
	loadHistory();
});
</script>

<template>
	<div class="version-history-ui">
		<div class="history-header">
			<h3>Version History</h3>
			<div class="header-actions">
				<button
					class="btn btn-secondary"
					:disabled="selectedVersions.length !== 2"
					@click="compareVersions"
				>
					Compare ({{ selectedVersions.length }}/2)
				</button>
				<button
					class="btn btn-secondary"
					@click="loadHistory"
				>
					Refresh
				</button>
			</div>
		</div>

		<div
			v-if="loading"
			class="loading-state"
		>
			Loading version history...
		</div>

		<div
			v-else-if="error"
			class="error-state"
		>
			{{ error }}
		</div>

		<div
			v-else-if="!history || history.versions.length === 0"
			class="empty-state"
		>
			No version history available
		</div>

		<div
			v-else
			class="history-content"
		>
			<div class="timeline">
				<div
					v-for="(version, index) in sortedVersions"
					:key="version.id"
					class="timeline-item"
					:class="{ selected: selectedVersions.includes(version.id) }"
				>
					<div class="timeline-marker">
						<div
							class="marker-dot"
							:class="getVersionBadgeClass(version)"
						/>
						<div
							v-if="index < sortedVersions.length - 1"
							class="marker-line"
						/>
					</div>

					<div class="timeline-content">
						<div class="version-header">
							<div class="version-info">
								<span class="version-number">v{{ version.version }}</span>
								<span
									class="version-badge"
									:class="getVersionBadgeClass(version)"
								>
									{{ version.isCurrent ? "Current" : "Previous" }}
								</span>
							</div>
							<span class="version-date">{{
								formatDate(version.createdAtISO)
							}}</span>
						</div>

						<div class="version-meta">
							<span class="version-author">
								<span class="author-avatar">{{
									version.authorName.charAt(0)
								}}</span>
								{{ version.authorName }}
							</span>
						</div>

						<p
							v-if="version.changeDescription"
							class="version-description"
						>
							{{ version.changeDescription }}
						</p>

						<div class="version-actions">
							<button
								class="action-btn"
								:class="{ active: selectedVersions.includes(version.id) }"
								@click="toggleVersionSelect(version.id)"
							>
								{{
									selectedVersions.includes(version.id)
									? "Selected"
									: "Select"
								}}
							</button>
							<button
								v-if="!version.isCurrent"
								class="action-btn action-btn-primary"
								@click="handleRestore(version)"
							>
								Restore
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div
			v-if="showDiff"
			class="diff-panel"
		>
			<div class="diff-header">
				<h4>Version Comparison</h4>
				<button
					class="close-btn"
					@click="showDiff = false"
				>
					×
				</button>
			</div>
			<div class="diff-content">
				<div class="diff-section">
					<h5>Added</h5>
					<div
						v-if="diffContent?.added.length"
						class="diff-list added"
					>
						<div
							v-for="item in diffContent.added"
							:key="item"
						>
							+ {{ item }}
						</div>
					</div>
					<p v-else>No additions</p>
				</div>
				<div class="diff-section">
					<h5>Removed</h5>
					<div
						v-if="diffContent?.removed.length"
						class="diff-list removed"
					>
						<div
							v-for="item in diffContent.removed"
							:key="item"
						>
							- {{ item }}
						</div>
					</div>
					<p v-else>No removals</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.version-history-ui {
	display: flex;
	flex-direction: column;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	background: #fff;
	overflow: hidden;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.history-header h3 {
	margin: 0;
	font-size: 1.125rem;
	font-weight: 600;
}

.header-actions {
	display: flex;
	gap: 0.5rem;
}

.loading-state,
.error-state,
.empty-state {
	padding: 2rem;
	text-align: center;
	color: #6b7280;
}

.error-state {
	color: #dc2626;
}

.history-content {
	padding: 1rem;
	max-height: 500px;
	overflow-y: auto;
}

.timeline {
	display: flex;
	flex-direction: column;
}

.timeline-item {
	display: flex;
	gap: 1rem;
	padding: 0.75rem;
	border-radius: 0.5rem;
	transition: background 0.2s;
}

.timeline-item:hover {
	background: #f9fafb;
}

.timeline-item.selected {
	background: #eff6ff;
	border: 1px solid #bfdbfe;
}

.timeline-marker {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.marker-dot {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #d1d5db;
}

.marker-dot.badge-current {
	background: #3b82f6;
}

.marker-line {
	flex: 1;
	width: 2px;
	background: #e5e7eb;
	margin-top: 0.5rem;
}

.timeline-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.version-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.version-info {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.version-number {
	font-weight: 600;
	color: #111827;
}

.version-badge {
	padding: 0.125rem 0.5rem;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-weight: 500;
}

.version-badge.badge-default {
	background: #f3f4f6;
	color: #6b7280;
}

.version-badge.badge-current {
	background: #dbeafe;
	color: #1d4ed8;
}

.version-date {
	font-size: 0.75rem;
	color: #9ca3af;
}

.version-meta {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.version-author {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.875rem;
	color: #6b7280;
}

.author-avatar {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: #e5e7eb;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
	font-weight: 500;
	color: #374151;
}

.version-description {
	margin: 0;
	font-size: 0.875rem;
	color: #374151;
	line-height: 1.5;
}

.version-actions {
	display: flex;
	gap: 0.5rem;
	margin-top: 0.25rem;
}

.action-btn {
	padding: 0.375rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.25rem;
	background: #fff;
	font-size: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
}

.action-btn:hover {
	background: #f3f4f6;
}

.action-btn.active {
	background: #dbeafe;
	border-color: #3b82f6;
	color: #1d4ed8;
}

.action-btn-primary {
	background: #f0fdf4;
	border-color: #86efac;
	color: #16a34a;
}

.action-btn-primary:hover {
	background: #dcfce7;
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-secondary {
	background: #fff;
	border: 1px solid #d1d5db;
	color: #374151;
}

.btn-secondary:hover:not(:disabled) {
	background: #f3f4f6;
}

.diff-panel {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	max-width: 600px;
	max-height: 80vh;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	z-index: 50;
}

.diff-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.diff-header h4 {
	margin: 0;
}

.close-btn {
	width: 28px;
	height: 28px;
	border: none;
	background: #f3f4f6;
	border-radius: 0.25rem;
	cursor: pointer;
	font-size: 1rem;
}

.diff-content {
	padding: 1rem;
	overflow-y: auto;
}

.diff-section {
	margin-bottom: 1rem;
}

.diff-section h5 {
	margin: 0 0 0.5rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: #374151;
}

.diff-list {
	font-family: monospace;
	font-size: 0.875rem;
	padding: 0.5rem;
	border-radius: 0.25rem;
}

.diff-list.added {
	background: #f0fdf4;
	color: #16a34a;
}

.diff-list.removed {
	background: #fef2f2;
	color: #dc2626;
}

.diff-list div {
	padding: 0.25rem 0;
}
</style>
