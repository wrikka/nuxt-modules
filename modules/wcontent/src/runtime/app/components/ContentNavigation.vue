<script setup lang="ts">
import type { NavigationItem } from "../composables/useContent";

interface Props {
  collection: string;
  items?: NavigationItem[];
}

const props = defineProps<Props>();

const { fetchNavigation } = useContentNavigation(props.collection);

const { data: navigation, pending } = useAsyncData(
  `navigation-${props.collection}`,
  () => props.items ? Promise.resolve(props.items) : fetchNavigation()
);
</script>

<template>
  <nav v-if="navigation?.length" class="content-nav" aria-label="Content navigation">
    <ul class="nav-list">
      <li v-for="item in navigation" :key="item.path" class="nav-item">
        <NuxtLink :to="item.path" class="nav-link" active-class="active">
          <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
          <span class="nav-title">{{ item.title }}</span>
        </NuxtLink>
        <ContentNavigation
          v-if="item.children?.length"
          :collection="collection"
          :items="item.children"
          class="nav-children"
        />
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.content-nav {
  padding: 0.5rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.25rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--color-bg-hover);
  color: var(--color-primary);
}

.nav-icon {
  width: 1.25rem;
  text-align: center;
}

.nav-children {
  padding-left: 1.5rem;
}
</style>
