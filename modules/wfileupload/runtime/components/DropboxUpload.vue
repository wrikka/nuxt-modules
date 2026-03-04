<template>
  <div class="dropbox-upload space-y-4">
    <div v-if="!isAuthenticated" class="text-center py-8">
      <Icon name="mdi:dropbox" class="w-12 h-12 mx-auto mb-4 text-blue-500" />
      <p class="text-gray-600 mb-4">เชื่อมต่อกับ Dropbox เพื่อนำเข้าไฟล์</p>
      <button
        @click="authenticate"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
      >
        <Icon name="mdi:login" class="w-5 h-5" />
        เข้าสู่ระบบ Dropbox
      </button>
    </div>

    <div v-else class="space-y-4">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
        <button
          @click="navigateToRoot"
          class="hover:text-blue-600 flex items-center gap-1"
        >
          <Icon name="mdi:home" class="w-4 h-4" />
          Root
        </button>
        <span v-for="(folder, index) in pathStack" :key="index" class="flex items-center gap-2">
          <Icon name="mdi:chevron-right" class="w-4 h-4" />
          <button
            @click="navigateToIndex(index)"
            class="hover:text-blue-600"
          >
            {{ folder.name }}
          </button>
        </span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-8">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
        <p class="text-gray-500">กำลังโหลด...</p>
      </div>

      <!-- File List -->
      <div v-else class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-2 text-sm font-medium grid grid-cols-[1fr,100px,100px] gap-4">
          <span>ชื่อ</span>
          <span>ขนาด</span>
          <span>แก้ไขล่าสุด</span>
        </div>

        <div class="divide-y max-h-[300px] overflow-y-auto">
          <!-- Parent Folder -->
          <button
            v-if="pathStack.length > 0"
            @click="navigateUp"
            class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
          >
            <Icon name="mdi:folder-arrow-up" class="w-5 h-5 text-gray-400" />
            <span class="text-gray-600">..</span>
          </button>

          <!-- Items -->
          <button
            v-for="item in items"
            :key="item.id"
            @click="item['.tag'] === 'folder' ? navigateToFolder(item) : selectFile(item)"
            :class="{ 'bg-blue-50': selectedFile?.id === item.id }"
            class="w-full px-4 py-3 grid grid-cols-[1fr,100px,100px] gap-4 items-center hover:bg-gray-50 text-left"
          >
            <div class="flex items-center gap-3 min-w-0">
              <Icon
                :name="item['.tag'] === 'folder' ? 'mdi:folder' : getFileIcon(item.name)"
                :class="item['.tag'] === 'folder' ? 'text-yellow-500' : 'text-gray-400'"
                class="w-5 h-5 flex-shrink-0"
              />
              <span class="truncate">{{ item.name }}</span>
            </div>
            <span class="text-sm text-gray-500">
              {{ item.size ? formatSize(item.size) : '-' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ item.client_modified ? formatDate(item.client_modified) : '-' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Selected File -->
      <div v-if="selectedFile" class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon :name="getFileIcon(selectedFile.name)" class="w-8 h-8 text-blue-500" />
            <div>
              <p class="font-medium">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">{{ formatSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button
            @click="importFile"
            :disabled="isImporting"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Icon v-if="isImporting" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <Icon v-else name="mdi:import" class="w-5 h-5" />
            {{ isImporting ? 'กำลังนำเข้า...' : 'นำเข้า' }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center">
        <button
          @click="logout"
          class="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
        >
          <Icon name="mdi:logout" class="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface DropboxItem {
  id: string
  name: string
  '.tag': 'file' | 'folder'
  path_lower: string
  size?: number
  client_modified?: string
}

interface DropboxFolder {
  id: string
  name: string
  path: string
}

const emit = defineEmits<{
  addFiles: [files: File[]]
}>()

const isAuthenticated = ref(false)
const isLoading = ref(false)
const isImporting = ref(false)
const items = ref<DropboxItem[]>([])
const pathStack = ref<DropboxFolder[]>([])
const selectedFile = ref<DropboxItem | null>(null)

// Dropbox API configuration
const DROPBOX_APP_KEY = '' // Should be configured via module options
const DROPBOX_AUTH_URL = 'https://www.dropbox.com/oauth2/authorize'
const DROPBOX_API_URL = 'https://api.dropboxapi.com/2'

const accessToken = ref('')

onMounted(() => {
  // Check for stored token
  const token = localStorage.getItem('dropbox_token')
  if (token) {
    accessToken.value = token
    isAuthenticated.value = true
    loadFolder('')
  }

  // Check for OAuth callback
  const hash = window.location.hash
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    if (token) {
      accessToken.value = token
      localStorage.setItem('dropbox_token', token)
      isAuthenticated.value = true
      loadFolder('')
      // Clear hash
      window.location.hash = ''
    }
  }
})

const authenticate = () => {
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname)
  const authUrl = `${DROPBOX_AUTH_URL}?client_id=${DROPBOX_APP_KEY}&response_type=token&redirect_uri=${redirectUri}`
  window.location.href = authUrl
}

const logout = () => {
  localStorage.removeItem('dropbox_token')
  accessToken.value = ''
  isAuthenticated.value = false
  items.value = []
  pathStack.value = []
  selectedFile.value = null
}

const loadFolder = async (path: string) => {
  if (!accessToken.value) return

  isLoading.value = true
  try {
    const response = await fetch(`${DROPBOX_API_URL}/files/list_folder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path || '',
        recursive: false,
        include_media_info: true
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        logout()
        return
      }
      throw new Error('Failed to load folder')
    }

    const data = await response.json()
    items.value = data.entries.sort((a: DropboxItem, b: DropboxItem) => {
      // Folders first, then alphabetical
      if (a['.tag'] === 'folder' && b['.tag'] !== 'folder') return -1
      if (a['.tag'] !== 'folder' && b['.tag'] === 'folder') return 1
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error('Error loading folder:', error)
  } finally {
    isLoading.value = false
  }
}

const navigateToFolder = (folder: DropboxItem) => {
  pathStack.value.push({
    id: folder.id,
    name: folder.name,
    path: folder.path_lower
  })
  selectedFile.value = null
  loadFolder(folder.path_lower)
}

const navigateUp = () => {
  if (pathStack.value.length === 0) return
  pathStack.value.pop()
  const parentPath = pathStack.value.length > 0
    ? pathStack.value[pathStack.value.length - 1].path
    : ''
  selectedFile.value = null
  loadFolder(parentPath)
}

const navigateToRoot = () => {
  pathStack.value = []
  selectedFile.value = null
  loadFolder('')
}

const navigateToIndex = (index: number) => {
  pathStack.value = pathStack.value.slice(0, index + 1)
  const path = pathStack.value.length > 0
    ? pathStack.value[pathStack.value.length - 1].path
    : ''
  selectedFile.value = null
  loadFolder(path)
}

const selectFile = (file: DropboxItem) => {
  selectedFile.value = file
}

const importFile = async () => {
  if (!selectedFile.value || !accessToken.value) return

  isImporting.value = true
  try {
    // Download file from Dropbox
    const response = await fetch(`${DROPBOX_API_URL}/files/download`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: selectedFile.value.path_lower
        })
      }
    })

    if (!response.ok) {
      throw new Error('Failed to download file')
    }

    const blob = await response.blob()
    const file = new File([blob], selectedFile.value.name, {
      type: response.headers.get('content-type') || 'application/octet-stream'
    })

    emit('addFiles', [file])
    selectedFile.value = null
  } catch (error) {
    console.error('Error importing file:', error)
  } finally {
    isImporting.value = false
  }
}

const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    'pdf': 'mdi:file-pdf',
    'doc': 'mdi:file-word',
    'docx': 'mdi:file-word',
    'xls': 'mdi:file-excel',
    'xlsx': 'mdi:file-excel',
    'ppt': 'mdi:file-powerpoint',
    'pptx': 'mdi:file-powerpoint',
    'jpg': 'mdi:file-image',
    'jpeg': 'mdi:file-image',
    'png': 'mdi:file-image',
    'gif': 'mdi:file-image',
    'mp4': 'mdi:file-video',
    'mp3': 'mdi:file-music',
    'zip': 'mdi:folder-zip'
  }
  return iconMap[ext || ''] || 'mdi:file-document'
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric'
  })
}
</script>
