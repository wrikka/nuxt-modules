<template>
  <div class="azure-upload space-y-4">
    <!-- Configuration -->
    <div v-if="!isConfigured" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p class="text-blue-800 text-sm">
          เชื่อมต่อกับ Azure Blob Storage หรือให้ผู้ดูแลระบบกำหนดค่าในตัวเลือกโมดูล
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Storage Account Name</label>
          <input
            v-model="config.accountName"
            type="text"
            placeholder="mystorageaccount"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Container Name</label>
          <input
            v-model="config.containerName"
            type="text"
            placeholder="mycontainer"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">SAS Token (หรือ)</label>
            <input
              v-model="config.sasToken"
              type="password"
              placeholder="?sv=2020-08-04&..."
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Access Key</label>
            <input
              v-model="config.accessKey"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          @click="saveConfig"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <!-- Connection Status -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'" />
          <span class="text-sm">{{ isConnected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ' }}</span>
          <span class="text-sm text-gray-500">| {{ config.accountName }} / {{ config.containerName }}</span>
        </div>
        <button @click="editConfig" class="text-sm text-blue-600 hover:text-blue-800">
          แก้ไขการตั้งค่า
        </button>
      </div>

      <!-- Blob Browser -->
      <div v-if="isConnected" class="space-y-4">
        <!-- Path Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <button @click="navigateToRoot" class="hover:text-blue-600 flex items-center gap-1">
            <Icon name="mdi:database" class="w-4 h-4" />
            {{ config.containerName }}
          </button>
          <span v-for="(folder, index) in currentPath.split('/').filter(Boolean)" :key="index" class="flex items-center gap-1">
            <Icon name="mdi:chevron-right" class="w-4 h-4" />
            {{ folder }}
          </span>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="prefixFilter"
            type="text"
            placeholder="ค้นหา blob..."
            class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon name="mdi:magnify" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-8">
          <Icon name="mdi:loading" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p class="text-gray-500">กำลังโหลด...</p>
        </div>

        <!-- Blob List -->
        <div v-else class="border rounded-lg overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 text-sm font-medium grid grid-cols-[1fr,100px,100px] gap-4">
            <span>ชื่อ</span>
            <span>ขนาด</span>
            <span>แก้ไขล่าสุด</span>
          </div>

          <div class="divide-y max-h-[300px] overflow-y-auto">
            <!-- Parent Folder -->
            <button
              v-if="currentPath"
              @click="navigateUp"
              class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 text-left"
            >
              <Icon name="mdi:folder-arrow-up" class="w-5 h-5 text-gray-400" />
              <span class="text-gray-600">..</span>
            </button>

            <!-- Items -->
            <button
              v-for="item in filteredItems"
              :key="item.name"
              @click="item.isFolder ? navigateToFolder(item.name) : selectFile(item)"
              :class="{ 'bg-blue-50': selectedFile?.name === item.name }"
              class="w-full px-4 py-3 grid grid-cols-[1fr,100px,100px] gap-4 items-center hover:bg-gray-50 text-left"
            >
              <div class="flex items-center gap-3 min-w-0">
                <Icon
                  :name="item.isFolder ? 'mdi:folder' : getFileIcon(item.name)"
                  :class="item.isFolder ? 'text-blue-500' : 'text-gray-400'"
                  class="w-5 h-5 flex-shrink-0"
                />
                <span class="truncate">{{ getItemName(item.name) }}</span>
              </div>
              <span class="text-sm text-gray-500">
                {{ item.properties?.['content-length'] ? formatSize(parseInt(item.properties['content-length'])) : '-' }}
              </span>
              <span class="text-sm text-gray-500">
                {{ item.properties?.['last-modified'] ? formatDate(item.properties['last-modified']) : '-' }}
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
                <p class="font-medium">{{ getItemName(selectedFile.name) }}</p>
                <p class="text-sm text-gray-600">
                  {{ selectedFile.properties?.['content-length'] ? formatSize(parseInt(selectedFile.properties['content-length'])) : '-' }}
                </p>
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
      </div>

      <!-- Test Connection -->
      <button
        v-if="!isConnected"
        @click="testConnection"
        :disabled="isTesting"
        class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        <Icon v-if="isTesting" name="mdi:loading" class="w-5 h-5 animate-spin" />
        <Icon v-else name="mdi:connection" class="w-5 h-5" />
        {{ isTesting ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface AzureConfig {
  accountName: string
  containerName: string
  sasToken?: string
  accessKey?: string
}

interface BlobItem {
  name: string
  isFolder: boolean
  properties?: Record<string, string>
}

const emit = defineEmits<{
  addFiles: [files: File[]]
}>()

const config = ref<AzureConfig>({
  accountName: '',
  containerName: '',
  sasToken: '',
  accessKey: ''
})

const isConfigured = ref(false)
const isConnected = ref(false)
const isLoading = ref(false)
const isTesting = ref(false)
const isImporting = ref(false)
const items = ref<BlobItem[]>([])
const currentPath = ref('')
const prefixFilter = ref('')
const selectedFile = ref<BlobItem | null>(null)

const baseUrl = computed(() => {
  return `https://${config.value.accountName}.blob.core.windows.net/${config.value.containerName}`
})

const filteredItems = computed(() => {
  if (!prefixFilter.value) return items.value
  const filter = prefixFilter.value.toLowerCase()
  return items.value.filter(item =>
    item.name.toLowerCase().includes(filter)
  )
})

onMounted(() => {
  const saved = localStorage.getItem('azure_config')
  if (saved) {
    config.value = JSON.parse(saved)
    isConfigured.value = true
    testConnection()
  }
})

const saveConfig = () => {
  localStorage.setItem('azure_config', JSON.stringify(config.value))
  isConfigured.value = true
  testConnection()
}

const editConfig = () => {
  isConfigured.value = false
  isConnected.value = false
}

const testConnection = async () => {
  isTesting.value = true
  try {
    // Try to list blobs with max 1 result to test connection
    await listBlobs('', 1)
    isConnected.value = true
  } catch (error) {
    console.error('Connection failed:', error)
    isConnected.value = false
  } finally {
    isTesting.value = false
  }
}

const listBlobs = async (prefix: string, maxResults = 100) => {
  isLoading.value = true
  try {
    const url = new URL(baseUrl.value)
    url.searchParams.set('restype', 'container')
    url.searchParams.set('comp', 'list')
    url.searchParams.set('maxresults', maxResults.toString())
    if (prefix) {
      url.searchParams.set('prefix', prefix)
    }

    // Add SAS token if available
    if (config.value.sasToken) {
      const sasParams = new URLSearchParams(config.value.sasToken.replace('?', ''))
      sasParams.forEach((value, key) => {
        url.searchParams.set(key, value)
      })
    }

    const response = await fetch(url.toString())

    if (!response.ok) throw new Error('Failed to list blobs')

    const xml = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')

    // Parse blob prefixes (folders)
    const prefixes: BlobItem[] = Array.from(doc.querySelectorAll('BlobPrefix Name')).map(el => ({
      name: el.textContent || '',
      isFolder: true
    }))

    // Parse blobs
    const blobs: BlobItem[] = Array.from(doc.querySelectorAll('Blob')).map(el => {
      const name = el.querySelector('Name')?.textContent || ''
      const properties: Record<string, string> = {}
      el.querySelectorAll('Properties > *').forEach(prop => {
        if (prop.tagName && prop.textContent) {
          properties[prop.tagName.toLowerCase()] = prop.textContent
        }
      })
      return { name, isFolder: false, properties }
    })

    items.value = [...prefixes, ...blobs]
  } catch (error) {
    console.error('Error listing blobs:', error)
    items.value = []
  } finally {
    isLoading.value = false
  }
}

const navigateToFolder = (prefix: string) => {
  currentPath.value = prefix
  selectedFile.value = null
  listBlobs(prefix)
}

const navigateUp = () => {
  const parts = currentPath.value.split('/').filter(Boolean)
  parts.pop()
  const newPath = parts.length > 0 ? parts.join('/') + '/' : ''
  currentPath.value = newPath
  selectedFile.value = null
  listBlobs(newPath)
}

const navigateToRoot = () => {
  currentPath.value = ''
  selectedFile.value = null
  listBlobs('')
}

const selectFile = (file: BlobItem) => {
  selectedFile.value = file
}

const importFile = async () => {
  if (!selectedFile.value) return

  isImporting.value = true
  try {
    const url = new URL(`${baseUrl.value}/${selectedFile.value.name}`)

    // Add SAS token if available
    if (config.value.sasToken) {
      const sasParams = new URLSearchParams(config.value.sasToken.replace('?', ''))
      sasParams.forEach((value, key) => {
        url.searchParams.set(key, value)
      })
    }

    const response = await fetch(url.toString())

    if (!response.ok) throw new Error('Failed to download blob')

    const blob = await response.blob()
    const fileName = selectedFile.value.name.split('/').pop() || 'download'
    const file = new File([blob], fileName, { type: blob.type })

    emit('addFiles', [file])
    selectedFile.value = null
  } catch (error) {
    console.error('Error importing file:', error)
  } finally {
    isImporting.value = false
  }
}

const getItemName = (fullPath: string): string => {
  return fullPath.replace(currentPath.value, '').replace('/', '')
}

const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: 'mdi:file-pdf', doc: 'mdi:file-word', docx: 'mdi:file-word',
    xls: 'mdi:file-excel', xlsx: 'mdi:file-excel', jpg: 'mdi:file-image',
    jpeg: 'mdi:file-image', png: 'mdi:file-image', mp4: 'mdi:file-video'
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
