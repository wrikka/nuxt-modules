<script setup lang="ts">
import type { ChatFolder } from '../../types'
import { useChatFolders } from '../../composables/useCloudFeatures'

const { folders, activeFolder, setActiveFolder, createFolder } = useChatFolders()

const showNewFolderDialog = ref(false)
const newFolderName = ref('')
const newFolderIcon = ref('')

const folderIcons = [
  'i-lucide-users',
  'i-lucide-briefcase',
  'i-lucide-heart',
  'i-lucide-gamepad-2',
  'i-lucide-graduation-cap',
  'i-lucide-home',
  'i-lucide-star',
  'i-lucide-archive'
]

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) return
  await createFolder(newFolderName.value, newFolderIcon.value)
  showNewFolderDialog.value = false
  newFolderName.value = ''
  newFolderIcon.value = ''
}

const selectFolder = (folderId: string | null) => {
  setActiveFolder(folderId)
}
</script>

<template>
  <div class="flex flex-col h-full border-r">
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b">
      <AtomsText weight="semibold">Chat Folders</AtomsText>
      <AtomsButton variant="ghost" size="icon-sm" @click="showNewFolderDialog = true">
        <span class="i-lucide-plus w-4 h-4" />
      </AtomsButton>
    </div>

    <!-- Folder List -->
    <div class="flex-1 overflow-y-auto py-2">
      <!-- All Chats -->
      <button
        class="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-hover"
        :class="{ 'bg-surface-active': activeFolder === null }"
        @click="selectFolder(null)"
      >
        <span class="i-lucide-message-square w-5 h-5" />
        <span class="flex-1">All Chats</span>
      </button>

      <!-- Folders -->
      <button
        v-for="folder in folders"
        :key="folder.id"
        class="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-hover"
        :class="{ 'bg-surface-active': activeFolder === folder.id }"
        @click="selectFolder(folder.id)"
      >
        <span
          :class="folder.icon || 'i-lucide-folder'"
          class="w-5 h-5"
          :style="folder.iconColor ? { color: folder.iconColor } : undefined"
        />
        <span class="flex-1 truncate">{{ folder.title }}</span>
        <span v-if="folder.isDefault" class="text-xs text-muted">Default</span>
      </button>

      <!-- Divider -->
      <AtomsDivider class="my-2" />

      <!-- Preset folders -->
      <button class="w-full flex items-center gap-3 px-3 py-2 text-left text-muted hover:bg-surface-hover">
        <span class="i-lucide-archive w-5 h-5" />
        <span>Archived</span>
      </button>
    </div>

    <!-- New Folder Dialog -->
    <MoleculesDialog v-model:open="showNewFolderDialog">
      <MoleculesDialogContent class="sm:max-w-[425px]">
        <MoleculesDialogHeader>
          <MoleculesDialogTitle>New Folder</MoleculesDialogTitle>
          <MoleculesDialogDescription>
            Create a new folder to organize your chats
          </MoleculesDialogDescription>
        </MoleculesDialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <AtomsLabel for="folder-name">Folder Name</AtomsLabel>
            <AtomsInput
              id="folder-name"
              v-model="newFolderName"
              placeholder="e.g., Work, Family, Friends"
              @keyup.enter="handleCreateFolder"
            />
          </div>

          <div class="grid gap-2">
            <AtomsLabel>Choose Icon</AtomsLabel>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="icon in folderIcons"
                :key="icon"
                class="w-10 h-10 flex items-center justify-center rounded-lg border transition-colors"
                :class="[
                  newFolderIcon === icon
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                ]"
                @click="newFolderIcon = icon"
              >
                <span :class="icon" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <MoleculesDialogFooter>
          <AtomsButton variant="outline" @click="showNewFolderDialog = false">
            Cancel
          </AtomsButton>
          <AtomsButton @click="handleCreateFolder">
            Create Folder
          </AtomsButton>
        </MoleculesDialogFooter>
      </MoleculesDialogContent>
    </MoleculesDialog>
  </div>
</template>
