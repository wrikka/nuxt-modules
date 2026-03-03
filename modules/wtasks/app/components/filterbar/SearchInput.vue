<script setup lang="ts">
const { filter, setSearchTerm } = useTaskFilter();
const searchTerm = ref(filter.value.searchTerm);

watchDebounced(
	searchTerm,
	(newSearchTerm) => {
		setSearchTerm(newSearchTerm);
	},
	{ debounce: 300 },
);
</script>

<template>
  <div class="relative w-full max-w-xs">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon name="mdi:magnify" class="text-muted-foreground" />
    </div>
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Filter issues..."
      class="w-full rounded-md border border-border bg-background pl-10 pr-3 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
    />
  </div>
</template>
