<script setup lang="ts">
import type { Email } from '../../shared/types/email'
import type { Label } from '../../shared/types/label'
import type { MenuItem } from '../../shared/types/menu'

interface MenuOption {
  label: string
  icon: string
  action?: () => Promise<void> | void
  children?: MenuOption[]
  isDivider?: boolean
}

const router = useRouter()
const contextMenuStore = useContextMenuStore()
const modalStore = useModalStore()
const favoritesStore = useFavoritesStore()
const { isOpen, x, y, selectedItem } = storeToRefs(contextMenuStore)
const { close } = contextMenuStore
const { data: allLabels } = useFetch<Label[]>('/api/labels')
const contextMenuRef = ref(null)

// Type Guards
function isEmail(item: unknown): item is Email {
  return typeof item === 'object' && item !== null && 'subject' in item
}
function isSidebarItem(item: unknown): item is MenuItem {
  return typeof item === 'object' && item !== null && 'route' in item && 'text' in item
}

function createEmailMenuOptions(email: Email): MenuOption[] {
  const labelOptions: MenuOption[] = (allLabels.value || []).map(label => ({
    label: label.name,
    icon: email.labels.includes(label.name) ? 'mdi:check' : 'mdi:tag-outline',
    action: async () => {
      const currentLabels = email.labels || []
      const newLabels = currentLabels.includes(label.name)
        ? currentLabels.filter((l: string) => l !== label.name)
        : [...currentLabels, label.name]
      await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { labels: newLabels } })
      email.labels = newLabels
    },
  }))

  return [
    { label: 'Reply', icon: 'mdi:reply', action: () => router.push(`/email/${email.id}?reply=true`) },
    { label: 'Reply all', icon: 'mdi:reply-all', action: () => console.log('Reply All action triggered') },
    { label: 'Forward', icon: 'mdi:forward', action: () => console.log('Forward action triggered') },
    { isDivider: true, label: '', icon: '' },
    {
      label: email.read ? 'Mark as unread' : 'Mark as read',
      icon: 'mdi:email-outline',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { read: !email.read } })
        email.read = !email.read
      },
    },
    { label: 'Snooze', icon: 'mdi:clock-outline', action: () => modalStore.openSnoozeModal(email) },
    { isDivider: true, label: '', icon: '' },
    {
      label: email.starred ? 'Remove star' : 'Add star',
      icon: email.starred ? 'mdi:star' : 'mdi:star-outline',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { starred: !email.starred } })
        email.starred = !email.starred
      },
    },
    { label: 'Label as', icon: 'mdi:tag-outline', children: labelOptions },
    { isDivider: true, label: '', icon: '' },
    {
      label: 'Archive',
      icon: 'mdi:archive-outline',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { folder: 'archive' } })
        await refreshNuxtData()
      },
    },
    {
      label: 'Mark as spam',
      icon: 'mdi:alert-octagon-outline',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { folder: 'spam' } })
        await refreshNuxtData()
      },
    },
    {
      label: 'Delete',
      icon: 'mdi:trash-can-outline',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'DELETE' })
        await refreshNuxtData()
      },
    },
    { isDivider: true, label: '', icon: '' },
    {
      label: email.muted ? 'Unmute' : 'Mute',
      icon: email.muted ? 'mdi:volume-high' : 'mdi:volume-off',
      action: async () => {
        await $fetch(`/api/emails/${email.id}`, { method: 'PATCH', body: { muted: !email.muted } })
        email.muted = !email.muted
      },
    },
  ]
}

function createSidebarMenuOptions(sidebarItem: MenuItem): MenuOption[] {
  const isFav = favoritesStore.isFavorite(sidebarItem)
  return [
    {
      label: isFav ? 'Remove from favorites' : 'Add to favorites',
      icon: isFav ? 'mdi:star' : 'mdi:star-outline',
      action: () => {
        if (isFav)
          favoritesStore.removeFavorite(sidebarItem)
        else
          favoritesStore.addFavorite(sidebarItem)
      },
    },
  ]
}

const menuOptions = computed<MenuOption[]>(() => {
  if (!selectedItem.value) return []
  if (isEmail(selectedItem.value)) return createEmailMenuOptions(selectedItem.value)
  if (isSidebarItem(selectedItem.value)) return createSidebarMenuOptions(selectedItem.value)
  return []
})

async function executeAction(action?: () => Promise<void> | void) {
  if (action) {
    await action()
    close()
  }
}

onClickOutside(contextMenuRef, () => close(), { ignore: ['.context-menu-trigger'] })
</script>

<template>
  <div
    v-if="isOpen"
    ref="contextMenuRef"
    class="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-50"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <ul>
      <template v-for="(option, index) in menuOptions" :key="index">
        <li v-if="!option.isDivider" class="relative">
          <div
            class="flex items-center justify-between gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
            @click="executeAction(option.action)"
          >
            <div class="flex items-center gap-2">
              <Icon :name="option.icon" class="text-lg" />
              <span>{{ option.label }}</span>
            </div>
            <Icon v-if="option.children" name="mdi:chevron-right" class="text-lg" />

            <!-- Submenu -->
            <div v-if="option.children" class="absolute left-full top-0 mt-[-8px] ml-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 z-10 hidden group-hover:block">
              <ul>
                <li v-for="(child, childIndex) in option.children" :key="childIndex">
                  <div class="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" @click.stop="executeAction(child.action)">
                    <Icon :name="child.icon" class="text-lg" />
                    <span>{{ child.label }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li v-else>
          <hr class="my-1 border-gray-200 dark:border-gray-700" />
        </li>
      </template>
    </ul>
  </div>
</template>
