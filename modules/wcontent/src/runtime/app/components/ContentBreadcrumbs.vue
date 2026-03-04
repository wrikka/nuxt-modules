<script setup lang="ts">
interface Props {
  path: string;
  separator?: string;
  homeLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  separator: "/",
  homeLabel: "Home",
});

const breadcrumbs = computed(() => {
  const parts = props.path.split("/").filter(Boolean);
  const crumbs = [{ label: props.homeLabel, path: "/" }];
  
  let currentPath = "";
  for (const part of parts) {
    currentPath += `/${part}`;
    crumbs.push({
      label: part.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      path: currentPath,
    });
  }
  
  return crumbs;
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol class="breadcrumb-list">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
        class="breadcrumb-item"
        :class="{ 'is-active': index === breadcrumbs.length - 1 }"
      >
        <span v-if="index > 0" class="separator">{{ separator }}</span>
        <NuxtLink
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="breadcrumb-link"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  padding: 1rem 0;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.separator {
  margin: 0 0.5rem;
  color: var(--color-text-muted);
}

.breadcrumb-link {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-current {
  color: var(--color-text);
  font-weight: 500;
}

.is-active .breadcrumb-current {
  color: var(--color-text);
}
</style>
