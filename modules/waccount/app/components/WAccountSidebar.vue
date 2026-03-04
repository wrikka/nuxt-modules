<script setup lang="ts">
import type { NavItem } from "../../../types";

interface Props {
  user: UserProfile | null;
  navItems: NavItem[];
  currentTab: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "navigate", item: NavItem): void;
}>();

const sidebarItems = computed(() =>
  props.navItems.map(item => ({
    label: item.label,
    href: item.path,
    icon: item.icon,
    active: props.currentTab === item.id,
    badge: item.badge
  }))
);

const handleSelect = (item: { label: string; href?: string; icon?: string; active?: boolean; badge?: string | number }) => {
  const navItem = props.navItems.find(n => n.id === item.label.toLowerCase().replace(/\s+/g, '-'));
  if (navItem) {
    emit('navigate', navItem);
  }
};
</script>

<template>
  <OrganismsSidebar
    :items="sidebarItems"
    :collapsible="true"
    class="hidden lg:flex"
    @select="handleSelect"
  >
    <template #header>
      <AuthDashboardSidebarHeader :user="user" />
    </template>
    <template #footer>
      <AuthDashboardSidebarFooter />
    </template>
  </OrganismsSidebar>
</template>
