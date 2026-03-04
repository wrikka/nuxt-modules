<template>
  <div class="box-upload space-y-4">
    <div v-if="!isAuthenticated" class="text-center py-8">
      <Icon name="mdi:package-variant-closed" class="w-12 h-12 mx-auto mb-4 text-blue-600" />
      <p class="text-gray-600 mb-4">เชื่อมต่อกับ Box เพื่อนำเข้าไฟล์</p>
      <button
        @click="authenticate"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
      >
        <Icon name="mdi:login" class="w-5 h-5" />
        เข้าสู่ระบบ Box
      </button>
    </div>

    <div v-else class="space-y-4">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto">
        <button @click="navigateToRoot" class="hover:text-blue-600 flex items-center gap-1">
          <Icon name="mdi:home" class="w-4 h-4" />
          All Files
        </button>
        <span v-for="(folder, index) in pathStack" :key="index" class="flex items-center gap-2">
          <Icon name="mdi:chevron-right" class="w-4 h-4" />
          <button @click="navigateToIndex(index)" class="hover:text-blue-600">
            {{ folder.name }}
          </button>
        </span>
      </div>

      <!-- Search -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาไฟล์..."
          class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="searchFiles"
        />
        <Icon name="mdi:magnify" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <Icon name="mdi:close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-8">
        <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
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
            @click="item.type === 'folder' ? navigateToFolder(item) : selectFile(item)"
            :class="{ 'bg-blue-50': selectedFile?.id === item.id }"
            class="w-full px-4 py-3 grid grid-cols-[1fr,100px,100px] gap-4 items-center hover:bg-gray-50 text-left"
          >
            <div class="flex items-center gap-3 min-w-0">
              <Icon
                :name="item.type === 'folder' ? 'mdi:folder' : getFileIcon(item.name)"
                :class="item.type === 'folder' ? 'text-blue-400' : 'text-gray-400'"
                class="w-5 h-5 flex-shrink-0"
              />
              <span class="truncate">{{ item.name }}</span>
            </div>
            <span class="text-sm text-gray-500">
              {{ item.size ? formatSize(item.size) : '-' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ item.modified_at ? formatDate(item.modified_at) : '-' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Selected File -->
      <div v-if="selectedFile" class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon :name="getFileIcon(selectedFile.name)" class="w-8 h-8 text-blue-600" />
            <div>
              <p class="font-medium">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">{{ formatSize(selectedFile.size || 0) }}</p>
            </div>
          </div>
          <button
            @click="importFile"
            :disabled="isImporting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Icon v-if="isImporting" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <Icon v-else name="mdi:import" class="w-5 h-5" />
            {{ isImporting ? 'กำลังนำเข้า...' : 'นำเข้า' }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center">
        <button @click="logout" class="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
          <Icon name="mdi:logout" class="w-4 h-4" />
          ออกจากระบบ
        </button>
        <span class="text-sm text-gray-500">{{ items.length }} รายการ</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BoxItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  modified_at?: string
  path_collection?: { entries: Array<{ id: string; name: string }> }
}

const emit = defineEmits<{
  addFiles: [files: File[]]
}>()

const isAuthenticated = ref(false)
const isLoading = ref(false)
const isImporting = ref(false)
const items = ref<BoxItem[]>([])
const pathStack = ref<Array<{ id: string; name: string }>>([])
const selectedFile = ref<BoxItem | null>(null)
const searchQuery = ref('')
const currentFolderId = ref('0') // '0' is root in Box

const BOX_CLIENT_ID = '' // Configure via module options
const BOX_AUTH_URL = 'https://account.box.com/api/oauth2/authorize'
const BOX_API_URL = 'https://api.box.com/2.0'

const accessToken = ref('')

onMounted(() => {
  const token = localStorage.getItem('box_token')
  if (token) {
    accessToken.value = token
    isAuthenticated.value = true
    loadFolder('0')
  }

  // Check OAuth callback
  const hash = window.location.hash
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    if (token) {
      accessToken.value = token
      localStorage.setItem('box_token', token)
      isAuthenticated.value = true
      loadFolder('0')
      window.location.hash = ''
    }
  }
})

const authenticate = () => {
  const redirectUri = encodeURIComponent(window.location.origin + window.location.pathname)
  const authUrl = `${BOX_AUTH_URL}?response_type=token&client_id=${BOX_CLIENT_ID}&redirect_uri=${redirectUri}`
  window.location.href = authUrl
}

const logout = () => {
  localStorage.removeItem('box_token')
  accessToken.value = ''
  isAuthenticated.value = false
  items.value = []
  pathStack.value = []
  selectedFile.value = null
}

const loadFolder = async (folderId: string) => {
  if (!accessToken.value) return

  isLoading.value = true
  try {
    const response = await fetch(`${BOX_API_URL}/folders/${folderId}/items`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    })

    if (!response.ok) {
      if (response.status === 401) {
        logout()
        return
      }
      throw new Error('Failed to load folder')
    }

    const data = await response.json()
    items.value = data.entries.sort((a: BoxItem, b: BoxItem) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1
      if (a.type !== 'folder' && b.type === 'folder') return 1
      return a.name.localeCompare(b.name)
    })
    currentFolderId.value = folderId
  } catch (error) {
    console.error('Error loading folder:', error)
  } finally {
    isLoading.value = false
  }
}

const searchFiles = async () => {
  if (!accessToken.value || !searchQuery.value.trim()) return

  isLoading.value = true
  try {
    const response = await fetch(
      `${BOX_API_URL}/search?query=${encodeURIComponent(searchQuery.value)}&type=file`,
      { headers: { 'Authorization': `Bearer ${accessToken.value}` } }
    )

    if (!response.ok) throw new Error('Search failed')

    const data = await response.json()
    items.value = data.entries || []
  } catch (error) {
    console.error('Error searching:', error)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  loadFolder(currentFolderId.value)
}

const navigateToFolder = (folder: BoxItem) => {
  pathStack.value.push({ id: folder.id, name: folder.name })
  selectedFile.value = null
  loadFolder(folder.id)
}

const navigateUp = () => {
  if (pathStack.value.length === 0) return
  pathStack.value.pop()
  const parentId = pathStack.value.length > 0
    ? pathStack.value[pathStack.value.length - 1].id
    : '0'
  selectedFile.value = null
  loadFolder(parentId)
}

const navigateToRoot = () => {
  pathStack.value = []
  selectedFile.value = null
  loadFolder('0')
}

const navigateToIndex = (index: number) => {
  pathStack.value = pathStack.value.slice(0, index + 1)
  const folderId = pathStack.value.length > 0
    ? pathStack.value[pathStack.value.length - 1].id
    : '0'
  selectedFile.value = null
  loadFolder(folderId)
}

const selectFile = (file: BoxItem) => {
  selectedFile.value = file
}

const importFile = async () => {
  if (!selectedFile.value || !accessToken.value) return

  isImporting.value = true
  try {
    const response = await fetch(`${BOX_API_URL}/files/${selectedFile.value.id}/content`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    })

    if (!response.ok) throw new Error('Failed to download file')

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
  const icons: Record<string, string> = {
    pdf: 'mdi:file-pdf', doc: 'mdi:file-word', docx: 'mdi:file-word',
    xls: 'mdi:file-excel', xlsx: 'mdi:file-excel', ppt: 'mdi:file-powerpoint',
    jpg: 'mdi:file-image', jpeg: 'mdi:file-image', png: 'mdi:file-image',
    mp4: 'mdi:file-video', mp3: 'mdi:file-music'
  }
  return icons[ext || ''] || 'mdi:file-document'
}

const formatSize = (bytes: number): string => {
  if (!bytes) return '-'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
}
</script>
