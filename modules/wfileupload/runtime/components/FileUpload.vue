<template>
  <!-- Trigger Button -->
  <button
    @click="openModal"
    class="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
  >
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
    </svg>
    อัปโหลดไฟล์
  </button>

  <!-- Modal Backdrop -->
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">อัปโหลดไฟล์</h2>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Tab Navigation -->
          <TabNavigation :tabs="_tabs" :active-tab="activeTab" @tab-change="handleTabChange" />

          <!-- Tab Content -->
          <div class="tab-content">
            <UploadArea v-if="activeTab === 'computer'" ref="uploadArea" :files="files" :config="config" @add-files="addFiles" @remove-file="_removeFile" @clear-files="clearFiles" @trigger-select="_triggerFileSelect" @reorder-files="handleReorderFiles" />
            <GitHubUpload v-if="activeTab === 'github'" @add-files="addFilesFromTab" />
            <OneDriveUpload v-if="activeTab === 'onedrive'" @add-files="addFilesFromTab" />
            <GoogleDrive v-if="activeTab === 'googledrive'" @add-files="addFilesFromTab" />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            :disabled="files.length === 0"
            @click="_confirmUpload"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            อัปโหลด ({{ files.length }})
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UploadArea from './UploadArea.vue'
import GitHubUpload from './GitHubUpload.vue'
import OneDriveUpload from './OneDriveUpload.vue'
import GoogleDrive from './GoogleDrive.vue'
import TabNavigation from './TabNavigation.vue'

const props = defineProps<{
  modelValue?: boolean
}>()

const {
  files,
  isUploading,
  canAddMoreFiles,
  validateAndAddFiles,
  removeFile,
  clearFiles,
  uploadFiles,
  config
} = useFileUpload()

const internalIsOpen = ref(false)
const uploadArea = ref()
const activeTab = ref('computer')

// Tab management
const _tabs = ref([
  { id: 'computer', label: 'Computer' },
  { id: 'github', label: 'GitHub' },
  { id: 'onedrive', label: 'OneDrive' },
  { id: 'googledrive', label: 'Google Drive' }
])

// Modal state
const isOpen = computed({
  get: () => props.modelValue ?? internalIsOpen.value,
  set: (value) => {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', value)
    } else {
      internalIsOpen.value = value
    }
  }
})

// Functions using composables
const addFiles = (fileList: FileList | File[]) => {
  const addedFiles = validateAndAddFiles(fileList)
  if (addedFiles.length > 0) {
    emit('filesChanged', files.value.map((f: any) => f.file))
  }
}

const addFilesFromTab = (fileList: FileList | File[]) => {
  addFiles(fileList)
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  clearFiles()
}

const _triggerFileSelect = () => {
  uploadArea.value?.triggerSelect()
}

const _removeFile = (index: number) => {
  // Find file by index in current files array
  const fileToRemove = files.value[index]
  if (fileToRemove) {
    removeFile(fileToRemove.id)
    emit('filesChanged', files.value.map((f: any) => f.file))
  }
}

const handleReorderFiles = (reorderedFiles: any[]) => {
  // Update the files array by clearing and re-adding in new order
  clearFiles()
  // Since validateAndAddFiles expects File objects, extract them
  const fileObjects = reorderedFiles.map(f => f.file)
  validateAndAddFiles(fileObjects)
  emit('filesChanged', fileObjects)
}

const closeModal = () => {
  isOpen.value = false
  // Reset to computer tab when closing
  activeTab.value = 'computer'
}

const _confirmUpload = () => {
  if (files.value.length > 0) {
    const fileObjects = files.value.map((f: any) => f.file)
    emit('confirmUpload', fileObjects)
    closeModal()
  }
}

const openModal = () => { isOpen.value = true }

const emit = defineEmits<{
  filesChanged: [files: File[]]
  confirmUpload: [files: File[]]
  'update:modelValue': [value: boolean]
}>()

// Expose methods for parent component
defineExpose({
  clearFiles,
  getFiles: () => files.value,
  closeModal,
  openModal
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.upload-area {
  transition: all 0.2s ease;
}
</style>
