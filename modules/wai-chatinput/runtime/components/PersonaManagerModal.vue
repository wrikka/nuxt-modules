<template>
  <transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">จัดการตัวละคร AI</h2>
          <button
            @click="$emit('close')"
            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <!-- Create New Persona -->
          <div class="mb-4">
            <button
              @click="$emit('toggleCreateForm')"
              class="w-full flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
            >
              <Icon name="mdi:plus" class="w-4 h-4 mr-2" />
              สร้างตัวละครใหม่
            </button>
          </div>

          <!-- Create Form -->
          <div v-if="showCreateForm" class="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                <input
                  v-model="newPersonaModel.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ชื่อตัวละคร"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <input
                  v-model="newPersonaModel.description"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="คำอธิบายตัวละคร"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea
                  v-model="newPersonaModel.systemPrompt"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="คำสั่งระบบสำหรับตัวละครนี้"
                ></textarea>
              </div>
              <div class="flex gap-2">
                <button
                  @click="$emit('create')"
                  :disabled="!newPersona.name.trim()"
                  class="px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  สร้าง
                </button>
                <button
                  @click="$emit('cancel')"
                  class="px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>

          <!-- Custom Personas List -->
          <div v-if="customAgents.length > 0" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700">ตัวละครที่สร้างเอง</h3>
            <div
              v-for="agent in customAgents"
              :key="agent.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">{{ agent.name }}</h4>
                <p class="text-xs text-gray-500 truncate">{{ agent.description || 'ไม่มีคำอธิบาย' }}</p>
              </div>
              <div class="flex gap-1">
                <button
                  @click="$emit('edit', agent)"
                  class="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                  title="แก้ไข"
                >
                  <Icon name="mdi:pencil" class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('delete', agent.id)"
                  class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="ลบ"
                >
                  <Icon name="mdi:delete" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="!showCreateForm" class="text-center py-8 text-gray-500">
            <Icon name="mdi:account-group" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p class="text-sm">ยังไม่มีตัวละครที่สร้างเอง</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Agent {
  id: string
  name: string
  description?: string
}

const props = defineProps<{
  show: boolean
  showCreateForm: boolean
  newPersona: {
    name: string
    description: string
    systemPrompt: string
  }
  customAgents: readonly any[]
}>()

const emit = defineEmits<{
  close: []
  toggleCreateForm: []
  create: []
  cancel: []
  edit: [agent: Agent]
  delete: [id: string]
  'update:newPersona': [persona: { name: string; description: string; systemPrompt: string }]
}>()

const newPersonaModel = computed({
  get: () => props.newPersona,
  set: (value) => emit('update:newPersona', value)
})
</script>
