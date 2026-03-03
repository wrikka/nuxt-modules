<template>
  <div class="stat-card">
    <h3>{{ value }}</h3>
    <p>{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	value: number | string
	label: string
}>()
</script>

<style scoped>
.stat-card {
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	text-align: center;
}

.stat-card h3 {
	font-size: 2rem;
	margin: 0;
	color: #2563eb;
}

.stat-card p {
	margin: 0.5rem 0 0 0;
	color: #6b7280;
}
</style>
