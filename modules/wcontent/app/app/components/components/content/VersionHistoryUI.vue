<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ContentVersion, VersionHistory } from "../../../../shared/types/version-control";
import { useVersionControl } from "../../../composables/useVersionControl";
import VersionTimeline from "./version/VersionTimeline.vue";
import VersionDiffModal from "./version/VersionDiffModal.vue";

const props = defineProps<{ contentPath: string }>();
const emit = defineEmits<{ restore: [version: ContentVersion]; compare: [versionA: ContentVersion, versionB: ContentVersion] }>();

const { getVersionHistory, rollback } = useVersionControl();

const history = ref<VersionHistory | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedVersions = ref<string[]>([]);
const showDiff = ref(false);
const diffContent = ref<{ added: string[]; removed: string[]; modified: string[] } | null>(null);

const sortedVersions = computed(() => history.value ? [...history.value.versions].sort((a, b) => b.version - a.version) : []);

const loadHistory = async () => {
	loading.value = true;
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
	if (index > -1) selectedVersions.value.splice(index, 1);
	else if (selectedVersions.value.length < 2) selectedVersions.value.push(versionId);
};

const compareVersions = () => {
	if (selectedVersions.value.length !== 2) return;
	const v1 = history.value?.versions.find(v => v.id === selectedVersions.value[0]);
	const v2 = history.value?.versions.find(v => v.id === selectedVersions.value[1]);
	if (v1 && v2) { emit("compare", v1, v2); showDiff.value = true; }
};

onMounted(() => loadHistory());
</script>

<template>
	<div class="version-history-ui">
		<div class="history-header">
			<h3>Version History</h3>
			<div class="header-actions">
				<button class="btn btn-secondary" :disabled="selectedVersions.length !== 2" @click="compareVersions">Compare ({{ selectedVersions.length }}/2)</button>
				<button class="btn btn-secondary" @click="loadHistory">Refresh</button>
			</div>
		</div>

		<div v-if="loading" class="loading-state">Loading version history...</div>
		<div v-else-if="error" class="error-state">{{ error }}</div>
		<div v-else-if="!history || history.versions.length === 0" class="empty-state">No version history available</div>

		<div v-else class="history-content">
			<VersionTimeline :versions="sortedVersions" :selected-versions="selectedVersions" @toggle="toggleVersionSelect" @restore="handleRestore" />
		</div>

		<VersionDiffModal v-if="showDiff" :diff-content="diffContent" @close="showDiff = false" />
	</div>
</template>

<style scoped>
.version-history-ui { display: flex; flex-direction: column; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: #fff; overflow: hidden; }
.history-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
.history-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
.header-actions { display: flex; gap: 0.5rem; }
.loading-state, .error-state, .empty-state { padding: 2rem; text-align: center; color: #6b7280; }
.error-state { color: #dc2626; }
.history-content { padding: 1rem; max-height: 500px; overflow-y: auto; }
.btn { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: #fff; border: 1px solid #d1d5db; color: #374151; }
.btn-secondary:hover:not(:disabled) { background: #f3f4f6; }
</style>
