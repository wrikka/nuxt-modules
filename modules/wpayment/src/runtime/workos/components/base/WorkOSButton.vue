<template>
  <button :class="['btn', variant, { sm }]" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
	variant?: "primary" | "secondary" | "danger"
	sm?: boolean
	disabled?: boolean
}>()

defineEmits<{
	click: []
}>()
</script>

<style scoped>
.btn {
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s;
}

.btn:disabled {
	background: #9ca3af;
	cursor: not-allowed;
}

.btn.primary {
	background: #2563eb;
	color: white;
}

.btn.primary:hover:not(:disabled) {
	background: #1d4ed8;
}

.btn.secondary {
	background: #6b7280;
	color: white;
}

.btn.secondary:hover {
	background: #4b5563;
}

.btn.danger {
	background: #dc2626;
	color: white;
}

.btn.danger:hover {
	background: #b91c1c;
}

.btn.sm {
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
}
</style>
