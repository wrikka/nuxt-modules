<template>
  <div class="s3-upload space-y-4">
    <!-- Configuration -->
    <div v-if="!isConfigured" class="space-y-4">
      <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p class="text-yellow-800 text-sm">
          กรุณากรอกข้อมูลการเชื่อมต่อ S3 หรือให้ผู้ดูแลระบบกำหนดค่าในตัวเลือกโมดูล
        </p>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium mb-1">Endpoint URL</label>
          <input
            v-model="config.endpoint"
            type="url"
            placeholder="https://s3.amazonaws.com หรือ https://minio.example.com"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium mb-1">Access Key</label>
            <input
              v-model="config.accessKey"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Secret Key</label>
            <input
              v-model="config.secretKey"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Bucket Name</label>
          <input
            v-model="config.bucket"
            type="text"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-center gap-2">
          <input
            id="s3-ssl"
            v-model="config.ssl"
            type="checkbox"
            class="w-4 h-4 rounded"
          />
          <label for="s3-ssl" class="text-sm">ใช้ SSL/HTTPS</label>
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
          <span class="text-sm text-gray-500">| Bucket: {{ config.bucket }}</span>
        </div>
        <button @click="editConfig" class="text-sm text-blue-600 hover:text-blue-800">
          แก้ไขการตั้งค่า
        </button>
      </div>

      <!-- Bucket Browser -->
      <div v-if="isConnected" class="space-y-4">
        <!-- Path Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <button @click="navigateToRoot" class="hover:text-blue-600">
            <Icon name="mdi:bucket" class="w-4 h-4" />
            {{ config.bucket }}
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
            placeholder="กรองตาม prefix..."
            class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon name="mdi:magnify" class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
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
              :key="item.Key || item.Prefix"
              @click="item.Prefix ? navigateToFolder(item.Prefix) : selectFile(item)"
              :class="{ 'bg-blue-50': selectedFile?.Key === item.Key }"
              class="w-full px-4 py-3 grid grid-cols-[1fr,100px,100px] gap-4 items-center hover:bg-gray-50 text-left"
            >
              <div class="flex items-center gap-3 min-w-0">
                <Icon
                  :name="item.Prefix ? 'mdi:folder' : getFileIcon(item.Key || '')"
                  :class="item.Prefix ? 'text-yellow-500' : 'text-gray-400'"
                  class="w-5 h-5 flex-shrink-0"
                />
                <span class="truncate">{{ getItemName(item) }}</span>
              </div>
              <span class="text-sm text-gray-500">
                {{ item.Size ? formatSize(item.Size) : '-' }}
              </span>
              <span class="text-sm text-gray-500">
                {{ item.LastModified ? formatDate(item.LastModified) : '-' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Selected File -->
        <div v-if="selectedFile" class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon :name="getFileIcon(selectedFile.Key || '')" class="w-8 h-8 text-blue-500" />
              <div>
                <p class="font-medium">{{ getItemName(selectedFile) }}</p>
                <p class="text-sm text-gray-600">{{ formatSize(selectedFile.Size || 0) }}</p>
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

      <!-- Test Connection Button -->
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

interface S3Config {
  endpoint: string
  accessKey: string
  secretKey: string
  bucket: string
  region?: string
  ssl: boolean
}

interface S3Item {
  Key?: string
  Size?: number
  LastModified?: string
  Prefix?: string
}

const emit = defineEmits<{
  addFiles: [files: File[]]
}>()

const config = ref<S3Config>({
  endpoint: '',
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: 'us-east-1',
  ssl: true
})

const isConfigured = ref(false)
const isConnected = ref(false)
const isLoading = ref(false)
const isTesting = ref(false)
const isImporting = ref(false)
const items = ref<S3Item[]>([])
const currentPath = ref('')
const prefixFilter = ref('')
const selectedFile = ref<S3Item | null>(null)

const filteredItems = computed(() => {
  if (!prefixFilter.value) return items.value
  const filter = prefixFilter.value.toLowerCase()
  return items.value.filter(item =>
    (item.Key?.toLowerCase().includes(filter) || item.Prefix?.toLowerCase().includes(filter))
  )
})

onMounted(() => {
  // Load config from localStorage or module options
  const saved = localStorage.getItem('s3_config')
  if (saved) {
    config.value = JSON.parse(saved)
    isConfigured.value = true
    testConnection()
  }
})

const saveConfig = () => {
  localStorage.setItem('s3_config', JSON.stringify(config.value))
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
    // List buckets or root to test connection
    await listObjects('')
    isConnected.value = true
  } catch (error) {
    console.error('Connection failed:', error)
    isConnected.value = false
  } finally {
    isTesting.value = false
  }
}

const listObjects = async (prefix: string) => {
  isLoading.value = true
  try {
    // S3 ListObjectsV2 API call
    const url = new URL(config.value.endpoint)
    url.pathname = `/${config.value.bucket}`
    url.searchParams.set('list-type', '2')
    url.searchParams.set('prefix', prefix)
    url.searchParams.set('delimiter', '/')
    url.searchParams.set('max-keys', '100')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `AWS ${config.value.accessKey}:${generateSignature()}`,
        'x-amz-date': new Date().toISOString()
      }
    })

    if (!response.ok) throw new Error('Failed to list objects')

    const xml = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')

    // Parse CommonPrefixes (folders)
    const prefixes: S3Item[] = Array.from(doc.querySelectorAll('CommonPrefixes Prefix')).map(el => ({
      Prefix: el.textContent || ''
    }))

    // Parse Contents (files)
    const contents: S3Item[] = Array.from(doc.querySelectorAll('Contents')).map(el => ({
      Key: el.querySelector('Key')?.textContent || '',
      Size: parseInt(el.querySelector('Size')?.textContent || '0'),
      LastModified: el.querySelector('LastModified')?.textContent || ''
    }))

    items.value = [...prefixes, ...contents.filter(c => c.Key !== prefix)]
  } catch (error) {
    console.error('Error listing objects:', error)
    items.value = []
  } finally {
    isLoading.value = false
  }
}

const generateSignature = (): string => {
  // Simplified signature generation - in production use proper AWS signature v4
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const stringToSign = `AWS4-HMAC-SHA256\n${date}\n${config.value.region}/s3/aws4_request`
  // Note: This is a placeholder - actual implementation needs crypto operations
  return btoa(stringToSign).slice(0, 28)
}

const navigateToFolder = (prefix: string) => {
  currentPath.value = prefix
  selectedFile.value = null
  listObjects(prefix)
}

const navigateUp = () => {
  const parts = currentPath.value.split('/').filter(Boolean)
  parts.pop()
  currentPath.value = parts.length > 0 ? parts.join('/') + '/' : ''
  selectedFile.value = null
  listObjects(currentPath.value)
}

const navigateToRoot = () => {
  currentPath.value = ''
  selectedFile.value = null
  listObjects('')
}

const selectFile = (file: S3Item) => {
  selectedFile.value = file
}

const importFile = async () => {
  if (!selectedFile.value?.Key) return

  isImporting.value = true
  try {
    const url = new URL(config.value.endpoint)
    url.pathname = `/${config.value.bucket}/${selectedFile.value.Key}`

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `AWS ${config.value.accessKey}:${generateSignature()}`
      }
    })

    if (!response.ok) throw new Error('Failed to download file')

    const blob = await response.blob()
    const fileName = selectedFile.value.Key.split('/').pop() || 'download'
    const file = new File([blob], fileName, { type: blob.type })

    emit('addFiles', [file])
    selectedFile.value = null
  } catch (error) {
    console.error('Error importing file:', error)
  } finally {
    isImporting.value = false
  }
}

const getItemName = (item: S3Item): string => {
  if (item.Prefix) {
    return item.Prefix.replace(currentPath.value, '').replace('/', '')
  }
  return item.Key?.replace(currentPath.value, '') || ''
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
