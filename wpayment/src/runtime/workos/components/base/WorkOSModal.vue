<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" :class="{ large }" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="btn-close" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	show: boolean
	title: string
	large?: boolean
}>()

defineEmits<{
	close: []
}>()
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-content.large {
	max-width: 800px;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem;
	border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
	margin: 0;
	color: #1f2937;
}

.btn-close {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
	color: #6b7280;
	padding: 0;
	line-height: 1;
}

.btn-close:hover {
	color: #1f2937;
}

.modal-body {
	padding: 1.5rem;
}

.modal-footer {
	display: flex;
	gap: 1rem;
	justify-content: flex-end;
	padding: 1rem 1.5rem;
	border-top: 1px solid #e5e7eb;
}
</style>
