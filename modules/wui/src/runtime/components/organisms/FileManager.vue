<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified: Date
  parentId?: string
}

interface Props {
  files: FileItem[]
  currentFolderId?: string
  selectedIds?: string[]
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  currentFolderId: undefined,
  selectedIds: () => [],
  viewMode: 'list'
})

const emit = defineEmits<{
  'navigate': [folderId: string]
  'select': [fileIds: string[]]
  'open': [file: FileItem]
  'delete': [fileIds: string[]]
  'rename': [fileId: string, newName: string]
  'upload': []
}>()

const breadcrumbs = computed(() => {
  const path: FileItem[] = []
  let current = props.files.find(f => f.id === props.currentFolderId)
  while (current) {
    path.unshift(current)
    current = props.files.find(f => f.id === current?.parentId)
  }
  return path
})

const currentFiles = computed(() => {
  return props.files.filter(f => f.parentId === props.currentFolderId)
})

const formatSize = (bytes?: number) => {
  if (!bytes) return '-'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }
  return `${size.toFixed(1)} ${units[unit]}`
}

const getIcon = (type: string) => {
  return type === 'folder' ? 'folder' : 'file'
}
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border border-gray-200 bg-white">
    <div class="flex items-center gap-2 border-b border-gray-200 p-3">
      <Button
        size="sm"
        variant="ghost"
        :disabled="breadcrumbs.length === 0"
        @click="$emit('navigate', breadcrumbs[breadcrumbs.length - 2]?.id || '')"
      >
        <span class="i-lucide-arrow-left" />
      </Button>
      <div class="flex items-center gap-1 text-sm">
        <button
          class="hover:text-blue-600"
          @click="$emit('navigate', '')"
        >
          Home
        </button>
        <span
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.id"
          class="flex items-center gap-1"
        >
          <span class="text-gray-400">/</span>
          <button
            class="hover:text-blue-600"
            @click="$emit('navigate', crumb.id)"
          >
            {{ crumb.name }}
          </button>
        </span>
      </div>
      <div class="ml-auto flex gap-2">
        <Button size="sm" variant="outline" @click="$emit('upload')">
          <span class="i-lucide-upload mr-1" />
          Upload
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :class="viewMode === 'list' ? 'bg-gray-100' : ''"
          @click="viewMode = 'list'"
        >
          <span class="i-lucide-list" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :class="viewMode === 'grid' ? 'bg-gray-100' : ''"
          @click="viewMode = 'grid'"
        >
          <span class="i-lucide-grid-3x3" />
        </Button>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="viewMode === 'grid'" class="grid grid-cols-4 gap-4">
        <div
          v-for="file in currentFiles"
          :key="file.id"
          class="cursor-pointer rounded-lg border p-4 text-center transition-colors hover:bg-gray-50"
          @click="file.type === 'folder' ? $emit('navigate', file.id) : $emit('open', file)"
        >
          <span :class="`i-lucide-${getIcon(file.type)} mx-auto mb-2 size-12 text-gray-400`" />
          <p class="truncate text-sm font-medium">{{ file.name }}</p>
          <p class="text-xs text-gray-400">{{ formatSize(file.size) }}</p>
        </div>
      </div>
      
      <table v-else class="w-full">
        <thead class="text-left text-sm text-gray-500">
          <tr>
            <th class="pb-2">Name</th>
            <th class="pb-2">Size</th>
            <th class="pb-2">Modified</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="file in currentFiles"
            :key="file.id"
            class="cursor-pointer border-t transition-colors hover:bg-gray-50"
            @click="file.type === 'folder' ? $emit('navigate', file.id) : $emit('open', file)"
          >
            <td class="flex items-center gap-2 py-2">
              <span :class="`i-lucide-${getIcon(file.type)} text-gray-400`" />
              {{ file.name }}
            </td>
            <td class="py-2 text-sm text-gray-500">{{ formatSize(file.size) }}</td>
            <td class="py-2 text-sm text-gray-500">
              <Time :value="file.modified" format="date" />
            </td>
          </tr>
        </tbody>
      </table>
      
      <EmptyState
        v-if="currentFiles.length === 0"
        icon="folder-open"
        title="Empty folder"
        description="This folder is empty"
      />
    </div>
  </div>
</template>
