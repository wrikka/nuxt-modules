<script setup lang="ts">
import type { ContentVersion, VersionHistory } from "../../../../../shared/types/version-control";

const props = defineProps<{
	versions: ContentVersion[]
	selectedVersions: string[]
}>()

const emit = defineEmits<{
	toggle: [versionId: string]
	restore: [version: ContentVersion]
}>()

const formatDate = (isoString: string) => {
	return new Date(isoString).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getBadgeClass = (version: ContentVersion) => version.isCurrent ? "badge-current" : "badge-default";
</script>

<template>
	<div class="timeline">
		<div v-for="(version, index) in versions" :key="version.id" class="timeline-item" :class="{ selected: selectedVersions.includes(version.id) }">
			<div class="timeline-marker">
				<div class="marker-dot" :class="getBadgeClass(version)" />
				<div v-if="index < versions.length - 1" class="marker-line" />
			</div>
			<div class="timeline-content">
				<div class="version-header">
					<div class="version-info">
						<span class="version-number">v{{ version.version }}</span>
						<span class="version-badge" :class="getBadgeClass(version)">{{ version.isCurrent ? "Current" : "Previous" }}</span>
					</div>
					<span class="version-date">{{ formatDate(version.createdAtISO) }}</span>
				</div>
				<div class="version-meta">
					<span class="version-author">
						<span class="author-avatar">{{ version.authorName.charAt(0) }}</span>
						{{ version.authorName }}
					</span>
				</div>
				<p v-if="version.changeDescription" class="version-description">{{ version.changeDescription }}</p>
				<div class="version-actions">
					<button class="action-btn" :class="{ active: selectedVersions.includes(version.id) }" @click="emit('toggle', version.id)">
						{{ selectedVersions.includes(version.id) ? "Selected" : "Select" }}
					</button>
					<button v-if="!version.isCurrent" class="action-btn action-btn-primary" @click="emit('restore', version)">Restore</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: 1rem; padding: 0.75rem; border-radius: 0.5rem; transition: background 0.2s; }
.timeline-item:hover { background: #f9fafb; }
.timeline-item.selected { background: #eff6ff; border: 1px solid #bfdbfe; }
.timeline-marker { display: flex; flex-direction: column; align-items: center; }
.marker-dot { width: 12px; height: 12px; border-radius: 50%; background: #d1d5db; }
.marker-dot.badge-current { background: #3b82f6; }
.marker-line { flex: 1; width: 2px; background: #e5e7eb; margin-top: 0.5rem; }
.timeline-content { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.version-header { display: flex; justify-content: space-between; align-items: center; }
.version-info { display: flex; align-items: center; gap: 0.5rem; }
.version-number { font-weight: 600; color: #111827; }
.version-badge { padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; }
.version-badge.badge-default { background: #f3f4f6; color: #6b7280; }
.version-badge.badge-current { background: #dbeafe; color: #1d4ed8; }
.version-date { font-size: 0.75rem; color: #9ca3af; }
.version-meta { display: flex; align-items: center; gap: 0.5rem; }
.version-author { display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: #6b7280; }
.author-avatar { width: 20px; height: 20px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 500; color: #374151; }
.version-description { margin: 0; font-size: 0.875rem; color: #374151; line-height: 1.5; }
.version-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
.action-btn { padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background: #fff; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { background: #f3f4f6; }
.action-btn.active { background: #dbeafe; border-color: #3b82f6; color: #1d4ed8; }
.action-btn-primary { background: #f0fdf4; border-color: #86efac; color: #16a34a; }
.action-btn-primary:hover { background: #dcfce7; }
</style>
