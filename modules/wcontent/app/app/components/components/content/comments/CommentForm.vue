<script setup lang="ts">
const props = defineProps<{
	avatar: string
	placeholder?: string
	rows?: number
	submitText: string
	disabled?: boolean
	showCancel?: boolean
}>()

const emit = defineEmits<{
	submit: [content: string]
	cancel: []
}>()

const content = ref("")
const placeholderText = props.placeholder || "Write a comment..."
const rowCount = props.rows || 3

const handleSubmit = () => {
	if (!content.value.trim()) return
	emit("submit", content.value.trim())
	content.value = ""
}
</script>

<template>
	<div class="comment-form">
		<div class="form-avatar">{{ avatar }}</div>
		<div class="form-input-wrapper">
			<textarea v-model="content" class="form-textarea" :placeholder="placeholderText" :rows="rowCount" @keydown.ctrl.enter="handleSubmit" />
			<div class="form-actions">
				<span class="form-hint">Ctrl+Enter to submit</span>
				<div class="flex gap-2">
					<button v-if="showCancel" class="btn btn-secondary" @click="emit('cancel')">Cancel</button>
					<button class="btn btn-primary" :disabled="!content.trim() || disabled" @click="handleSubmit">{{ submitText }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.comment-form { display: flex; gap: 0.75rem; padding: 1rem; border-bottom: 1px solid #e5e7eb; }
.form-avatar { width: 40px; height: 40px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
.form-input-wrapper { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.form-textarea { padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; resize: vertical; min-height: 80px; }
.form-textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.form-actions { display: flex; justify-content: space-between; align-items: center; }
.form-hint { font-size: 0.75rem; color: #9ca3af; }
.btn { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; transition: all 0.2s; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: #3b82f6; border: 1px solid #3b82f6; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #2563eb; }
.btn-secondary { background: #fff; border: 1px solid #d1d5db; color: #374151; }
.btn-secondary:hover:not(:disabled) { background: #f3f4f6; }
</style>
