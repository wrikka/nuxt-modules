<script setup lang="ts">
const props = defineProps<{
	diffContent: { added: string[]; removed: string[]; modified: string[] } | null
}>()

const emit = defineEmits<{
	close: []
}>()
</script>

<template>
	<div class="diff-panel">
		<div class="diff-header">
			<h4>Version Comparison</h4>
			<button class="close-btn" @click="emit('close')">×</button>
		</div>
		<div class="diff-content">
			<div class="diff-section">
				<h5>Added</h5>
				<div v-if="diffContent?.added.length" class="diff-list added">
					<div v-for="item in diffContent.added" :key="item">+ {{ item }}</div>
				</div>
				<p v-else>No additions</p>
			</div>
			<div class="diff-section">
				<h5>Removed</h5>
				<div v-if="diffContent?.removed.length" class="diff-list removed">
					<div v-for="item in diffContent.removed" :key="item">- {{ item }}</div>
				</div>
				<p v-else>No removals</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.diff-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; max-width: 600px; max-height: 80vh; background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; z-index: 50; }
.diff-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
.diff-header h4 { margin: 0; }
.close-btn { width: 28px; height: 28px; border: none; background: #f3f4f6; border-radius: 0.25rem; cursor: pointer; font-size: 1rem; }
.diff-content { padding: 1rem; overflow-y: auto; }
.diff-section { margin-bottom: 1rem; }
.diff-section h5 { margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600; color: #374151; }
.diff-list { font-family: monospace; font-size: 0.875rem; padding: 0.5rem; border-radius: 0.25rem; }
.diff-list.added { background: #f0fdf4; color: #16a34a; }
.diff-list.removed { background: #fef2f2; color: #dc2626; }
.diff-list div { padding: 0.25rem 0; }
</style>
