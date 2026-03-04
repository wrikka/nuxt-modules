<template>
  <div class="url-import space-y-4">
    <!-- URL Input -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        วาง URL ไฟล์ที่ต้องการนำเข้า
      </label>
      <div class="flex gap-2">
        <input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/file.pdf"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keydown.enter="importURL"
        />
        <button
          @click="importURL"
          :disabled="!isValidURL || isLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Icon v-if="isLoading" name="mdi:loading" class="w-5 h-5 animate-spin" />
          <Icon v-else name="mdi:import" class="w-5 h-5" />
          {{ isLoading ? 'กำลังโหลด...' : 'นำเข้า' }}
        </button>
      </div>
      <p v-if="urlError" class="text-red-500 text-sm">{{ urlError }}</p>
    </div>

    <!-- Multiple URLs -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        หรือวางหลาย URL (คั่นด้วยบรรทัดใหม่)
      </label>
      <textarea
        v-model="urlsInput"
        rows="4"
        placeholder="https://example.com/file1.pdf&#10;https://example.com/file2.jpg&#10;https://example.com/file3.png"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="importMultipleURLs"
        :disabled="!hasValidURLs || isLoadingMultiple"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoadingMultiple" name="mdi:loading" class="w-5 h-5 animate-spin" />
        <Icon v-else name="mdi:import" class="w-5 h-5" />
        {{ isLoadingMultiple ? 'กำลังโหลด...' : `นำเข้า ${validUrlCount} URL` }}
      </button>
    </div>

    <!-- Options -->
    <div class="bg-gray-50 p-4 rounded-lg space-y-3">
      <h4 class="font-medium text-gray-700">ตัวเลือก</h4>

      <div class="flex items-center gap-2">
        <input
          id="validate-size"
          v-model="validateSize"
          type="checkbox"
          class="w-4 h-4 rounded border-gray-300"
        />
        <label for="validate-size" class="text-sm">
          จำกัดขนาดไฟล์สูงสุด ({{ formatBytes(maxFileSize) }})
        </label>
      </div>

      <div v-if="validateSize" class="pl-6">
        <input
          v-model.number="maxFileSize"
          type="range"
          min="1048576"
          max="104857600"
          step="1048576"
          class="w-full"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 MB</span>
          <span>100 MB</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          id="validate-type"
          v-model="validateType"
          type="checkbox"
          class="w-4 h-4 rounded border-gray-300"
        />
        <label for="validate-type" class="text-sm">ตรวจสอบประเภทไฟล์</label>
      </div>

      <div v-if="validateType" class="pl-6 flex flex-wrap gap-2">
        <button
          v-for="type in allowedTypesList"
          :key="type"
          @click="toggleType(type)"
          :class="{ 'bg-blue-100 text-blue-700 border-blue-300': allowedTypes.includes(type) }"
          class="px-2 py-1 text-xs border rounded-full transition-colors"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Progress -->
    <div v-if="isLoading || isLoadingMultiple" class="space-y-2">
      <div class="flex justify-between text-sm">
        <span>กำลังดาวน์โหลด...</span>
        <span>{{ Math.round(downloadProgress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all"
          :style="{ width: `${downloadProgress}%` }"
        />
      </div>
      <p v-if="currentFileName" class="text-sm text-gray-600 truncate">
        {{ currentFileName }}
      </p>
    </div>

    <!-- Results -->
    <div v-if="results.length > 0" class="space-y-2">
      <h4 class="font-medium text-gray-700">ผลลัพธ์</h4>
      <div class="max-h-60 overflow-y-auto space-y-2">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="flex items-center justify-between p-3 rounded-lg"
          :class="result.success ? 'bg-green-50' : 'bg-red-50'"
        >
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate" :class="result.success ? 'text-green-700' : 'text-red-700'">
              {{ result.fileName || result.originalUrl }}
            </p>
            <p v-if="result.success" class="text-sm text-green-600">
              {{ formatBytes(result.fileSize) }} - {{ result.mimeType }}
            </p>
            <p v-else class="text-sm text-red-600">
              {{ result.error }}
            </p>
          </div>
          <Icon
            :name="result.success ? 'mdi:check-circle' : 'mdi:alert-circle'"
            class="w-5 h-5 flex-shrink-0"
            :class="result.success ? 'text-green-500' : 'text-red-500'"
          />
        </div>
      </div>
    </div>

    <!-- Import All Button -->
    <button
      v-if="successfulImports.length > 0"
      @click="importAllFiles"
      class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
    >
      <Icon name="mdi:check-all" class="w-5 h-5" />
      ใช้ {{ successfulImports.length }} ไฟล์ที่นำเข้าสำเร็จ
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { importFromURL, importFromURLs, isValidURL, type URLImportResult } from '../utils/urlImport'

const emit = defineEmits<{
  import: [files: File[]]
}>()

const urlInput = ref('')
const urlsInput = ref('')
const urlError = ref('')
const isLoading = ref(false)
const isLoadingMultiple = ref(false)
const downloadProgress = ref(0)
const currentFileName = ref('')
const results = ref<URLImportResult[]>([])

const validateSize = ref(true)
const maxFileSize = ref(50 * 1024 * 1024) // 50MB
const validateType = ref(false)
const allowedTypes = ref<string[]>(['image', 'video', 'application/pdf'])
const allowedTypesList = ['image', 'video', 'audio', 'application/pdf', 'text', 'application/json']

const isValidURL = computed(() => isValidURL_fn(urlInput.value))

const urlsList = computed(() => {
  return urlsInput.value
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0)
})

const validUrlCount = computed(() => {
  return urlsList.value.filter(isValidURL_fn).length
})

const hasValidURLs = computed(() => validUrlCount.value > 0)

const successfulImports = computed(() => {
  return results.value.filter(r => r.success && r.file)
})

function isValidURL_fn(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

function toggleType(type: string) {
  const index = allowedTypes.value.indexOf(type)
  if (index >= 0) {
    allowedTypes.value.splice(index, 1)
  } else {
    allowedTypes.value.push(type)
  }
}

const importURL = async () => {
  if (!isValidURL.value) return

  isLoading.value = true
  urlError.value = ''
  downloadProgress.value = 0
  currentFileName.value = ''

  try {
    const result = await importFromURL(urlInput.value, {
      maxSize: validateSize.value ? maxFileSize.value : undefined,
      timeout: 60000,
      allowedTypes: validateType.value ? allowedTypes.value : undefined,
      onProgress: (loaded, total) => {
        if (total > 0) {
          downloadProgress.value = (loaded / total) * 100
        }
      }
    })

    results.value = [result]

    if (!result.success) {
      urlError.value = result.error || 'Failed to import'
    }
  } catch (err) {
    urlError.value = 'An error occurred during import'
  } finally {
    isLoading.value = false
  }
}

const importMultipleURLs = async () => {
  const urls = urlsList.value.filter(isValidURL_fn)
  if (urls.length === 0) return

  isLoadingMultiple.value = true
  results.value = []
  downloadProgress.value = 0

  const total = urls.length
  let completed = 0

  try {
    const importPromises = urls.map(async (url) => {
      const result = await importFromURL(url, {
        maxSize: validateSize.value ? maxFileSize.value : undefined,
        timeout: 60000,
        allowedTypes: validateType.value ? allowedTypes.value : undefined
      })
      completed++
      downloadProgress.value = (completed / total) * 100
      return result
    })

    results.value = await Promise.all(importPromises)
  } catch (err) {
    console.error('Import error:', err)
  } finally {
    isLoadingMultiple.value = false
  }
}

const importAllFiles = () => {
  const files = successfulImports.value.map(r => r.file!)
  emit('import', files)
  // Reset after import
  urlInput.value = ''
  urlsInput.value = ''
  results.value = []
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i]
}
</script>
