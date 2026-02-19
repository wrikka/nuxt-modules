<script setup lang="ts">
import type { Label } from '../../shared/types/label'

const sidebarStore = useSidebarStore()
const favoritesStore = useFavoritesStore()
const { favoriteItems } = storeToRefs(favoritesStore)
const { isSidebarOpen } = storeToRefs(sidebarStore)
const contextMenuStore = useContextMenuStore()
const { open: openContextMenu } = contextMenuStore
const { data: labels } = useFetch<Label[]>('/api/labels')
const router = useRouter()

async function createDraftAndNavigate() {
  const newEmail = await $fetch('/api/emails', {
    method: 'POST',
    body: {
      subject: '',
      body: '',
      to: '',
      folder: 'drafts',
    },
  })
  await router.push(`/compose/${newEmail.id}`)
}

const route = useRoute()
const isDraftsActive = computed(() => {
  return route.path.startsWith('/drafts') || route.path.startsWith('/compose')
})

const isSettingsPage = computed(() => route.path.startsWith('/settings'))

const settingsMenuItems = [
  { icon: 'i-heroicons-arrow-left', text: 'Back to Inbox', route: '/' },
  { icon: 'i-heroicons-cog-8-tooth', text: 'General', route: '/settings' },
  { icon: 'i-heroicons-tag', text: 'Labels', route: '/settings/labels' },
  { icon: 'i-heroicons-scale', text: 'Rules', route: '/settings/rules' },
]

const menuItems = [
  { icon: 'mdi:inbox', text: 'All Inbox', route: '/', count: 1367 },
  { icon: 'mdi:star-outline', text: 'Starred', route: '/starred' },
  { icon: 'mdi:heart-outline', text: 'Favorites', route: '/favorited' },
  { icon: 'mdi:clock-outline', text: 'Snoozed', route: '/snoozed' },
  { icon: 'mdi:send-outline', text: 'Sent', route: '/sent' },
  { icon: 'mdi:file-document-outline', text: 'Drafts', route: '/drafts' },
  { icon: 'mdi:cart-outline', text: 'Purchases', route: '/purchases', count: 8 },
  { icon: 'mdi:archive-outline', text: 'Archived', route: '/archived' },
]
</script>

<template>
  <aside
    class="bg-slate-50 dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex-shrink-0 p-2 flex flex-col gap-y-2 overflow-y-auto transition-transform duration-300 ease-in-out md:w-64 md:relative fixed inset-y-0 left-0 z-20 w-full transform md:translate-x-0"
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div>
      <button class="flex items-center gap-3 bg-sky-100 dark:bg-sky-900 dark:bg-opacity-50 rounded-xl px-5 py-3 mb-4 shadow hover:shadow-lg transition-all font-medium text-sky-800 dark:text-sky-200 w-full" @click="createDraftAndNavigate">
        <Icon name="mdi:pencil" class="text-2xl" />
        <span>Compose</span>
      </button>
      <div class="space-y-4">
        <div>
          <h3 class="px-4 text-sm font-semibold text-slate-500 dark:text-zinc-400">Favorites</h3>
          <nav class="mt-2">
            <ul>
              <li v-for="item in favoriteItems" :key="item.text">
                <NuxtLink class="flex items-center justify-between px-4 py-1.5 rounded-e-full hover:bg-slate-200 dark:hover:bg-zinc-800" :to="item.route" active-class="bg-blue-50 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-slate-100" @contextmenu.prevent="openContextMenu($event, item)">
                  <div class="flex items-center gap-4">
                    <Icon :name="item.icon" class="text-lg" />
                    <span>{{ item.text }}</span>
                  </div>
                  <span v-if="item.count" class="text-xs font-bold text-slate-500 dark:text-zinc-400">{{ item.count }}</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <nav>
            <ul>
              <li v-for="item in menuItems" :key="item.text">
                <NuxtLink
                  class="flex items-center justify-between px-4 py-1.5 rounded-e-full hover:bg-slate-200 dark:hover:bg-zinc-800"
                  :to="item.route"
                  :class="{ 'bg-blue-50 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-slate-100': item.route === '/drafts' && isDraftsActive }"
                  active-class="bg-blue-50 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-slate-100"
                  @contextmenu.prevent="openContextMenu($event, item)"
                >
                  <div class="flex items-center gap-4">
                    <Icon :name="item.icon" class="text-lg" />
                    <span>{{ item.text }}</span>
                  </div>
                  <span v-if="item.count" class="text-xs font-bold text-slate-500 dark:text-zinc-400">{{ item.count }}</span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <div class="mt-auto">
      <nav>
        <ul>
          <li>
            <NuxtLink to="/settings" class="flex items-center gap-4 px-4 py-1.5 rounded-e-full hover:bg-slate-200 dark:hover:bg-zinc-800" active-class="bg-blue-50 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-slate-100">
              <Icon name="mdi:cog" class="text-lg" />
              <span>Settings</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="mt-6">
      <h3 class="px-4 text-sm font-semibold text-slate-500 dark:text-zinc-400">Labels</h3>
      <nav class="mt-2">
        <ul>
          <li v-for="label in labels" :key="label.name">
            <NuxtLink :to="`/label/${label.name}`" class="flex items-center gap-4 px-4 py-1.5 rounded-e-full hover:bg-slate-200 dark:hover:bg-zinc-800" active-class="bg-blue-50 dark:bg-zinc-800 font-semibold text-blue-600 dark:text-slate-100">
              <Icon :name="label.icon" class="text-lg" />
              <span>{{ label.name }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

  </aside>
</template>
