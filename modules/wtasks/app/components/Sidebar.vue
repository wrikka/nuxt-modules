<script setup lang="ts">
import type { List } from '~/shared/types/list';

const colorMode = useColorMode();
const { isSidebarOpen } = useSidebar();
const route = useRoute();

interface NavLink {
	label: string;
	icon: string;
	to?: string;
	color?: string;
}

const mainNav: NavLink[] = [
	{ icon: "mdi:magnify", label: "Search", to: "/search" },
	{ icon: "mdi:inbox", label: "Inbox", to: "/inbox" },
	{ icon: "mdi:check-circle-outline", label: "My Tasks", to: "/my-tasks" },
];

const { lists } = useTaskData();
const { deleteList } = useListApi();
const contextMenu = useContextMenu();
const modal = useModal();

function openContextMenu(event: MouseEvent, item: NavLink | List) {
	const isList = 'id' in item;
    const path = isList ? `/${item.id}` : item.to;
    if (!path) return;

	const options = [
		{ label: "Open", action: () => navigateTo(path) },
		{ label: "Open in new tab", action: () => window.open(path, "_blank") },
		{ label: "Copy link", action: () => navigator.clipboard.writeText(window.location.origin + path) },
	];

    if (isList) {
        options.push(
            { label: "Rename", action: () => alert(`Renaming ${item.label}`) },
            { label: "Delete", action: () => modal.open({ name: 'deleteList', list: item, onConfirm: () => deleteList((item as List).id) }) },
            { label: "Duplicate", action: () => alert(`Duplicating ${item.label}`) },
            { label: "Settings", action: () => modal.open({ name: 'listSettings', list: item }) },
        );
    }

	contextMenu.open({ x: event.x, y: event.y, options });
}
</script>

<template>
  <div class="flex flex-col h-full text-sm bg-card text-card-foreground">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 h-16 border-b border-border">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Icon name="mdi:flash" class="text-white w-5 h-5" />
      </div>
      <span v-if="isSidebarOpen" class="font-bold text-base truncate">Tasks App</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-4 overflow-y-auto p-2">
      <!-- Main Nav -->
      <ul class="space-y-1">
        <li v-for="item in mainNav" :key="item.label">
          <NuxtLink
            :to="item.to || '#_'"
            class="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            :class="{ 'bg-accent text-accent-foreground': route.path === item.to }"
            ~/contextmenu.prevent="openContextMenu($event, item)"
          >
            <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="isSidebarOpen" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Lists -->
      <div v-if="lists?.length">
        <div class="flex items-center justify-between px-3 mb-2">
          <h3 v-if="isSidebarOpen" class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Lists</h3>
          <button v-if="isSidebarOpen" class="text-muted-foreground hover:text-foreground" ~/click="modal.open({ name: 'addList' })">
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
        </div>
        <ul class="space-y-1">
          <li v-for="item in lists" :key="item.id">
            <NuxtLink
              :to="`/${item.id}`"
              class="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              :class="{ 'bg-accent text-accent-foreground': route.params.id === item.id }"
              ~/contextmenu.prevent="openContextMenu($event, item)"
            >
              <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="isSidebarOpen" class="truncate">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div class="mt-auto p-2 border-t border-border space-y-2">
      <button
        class="w-full flex items-center gap-3 p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        :class="{ 'justify-center': !isSidebarOpen }"
        ~/click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
      >
        <Icon :name="colorMode.value === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'" class="w-5 h-5 flex-shrink-0" />
        <span v-if="isSidebarOpen" class="truncate">Toggle Theme</span>
      </button>
      <button
        :class="['w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer', { 'justify-center': !isSidebarOpen }]"
      >
        <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="User Avatar" class="w-8 h-8 rounded-full flex-shrink-0">
        <div v-if="isSidebarOpen" class="text-left truncate">
          <p class="font-semibold text-foreground truncate">Jane Doe</p>
          <p class="text-xs text-muted-foreground truncate">jane.doe~/example.com</p>
        </div>
      </button>
    </div>
  </div>
</template>
