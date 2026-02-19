<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in data" :key="rowKey ? String(row[rowKey]) : i">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
	columns: Array<{ key: string; label: string }>
	data: Record<string, unknown>[]
	rowKey?: string
}>()
</script>

<style scoped>
.table-container {
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-table {
	width: 100%;
	border-collapse: collapse;
}

.data-table th,
.data-table td {
	padding: 1rem;
	text-align: left;
	border-bottom: 1px solid #e5e7eb;
}

.data-table th {
	background: #f9fafb;
	font-weight: 600;
	color: #374151;
}
</style>
