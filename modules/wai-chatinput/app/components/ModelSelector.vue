<template>
  <div class="flex gap-2 mb-4 items-center">
    <select :value="selectedModel.id" @change="(event) => $emit('selectModel', (event.target as HTMLSelectElement)?.value || '')" class="px-3 py-2 border rounded-md">
      <option v-for="model in models" :key="model.id" :value="model.id">{{ model.name }}</option>
    </select>
    <div class="flex gap-2">
      <select :value="selectedAgent.id" @change="(event) => $emit('selectAgent', (event.target as HTMLSelectElement)?.value || '')" class="px-3 py-2 border rounded-md">
        <option v-for="agent in agents" :key="agent.id" :value="agent.id">
          {{ agent.name }}{{ agent.isCustom ? ' (Custom)' : '' }}
        </option>
      </select>
      <button
        @click="showPersonaManager = !showPersonaManager"
        class="px-3 py-2 bg-gray-100 hover:bg-gray-200 border rounded-md transition-colors"
        title="จัดการตัวละคร AI"
      >
        <Icon name="mdi:account-cog" class="w-4 h-4" />
      </button>
    </div>

    <!-- Persona Manager Modal -->
    <PersonaManagerModal
      :show="showPersonaManager"
      @close="showPersonaManager = false"
      :showCreateForm="showCreateForm"
      :newPersona="newPersona"
      :customAgents="customAgents"
      @toggleCreateForm="showCreateForm = !showCreateForm"
      @create="createPersona"
      @cancel="cancelCreate"
      @edit="editPersona"
      @delete="confirmDeletePersona"
      @update:newPersona="newPersona = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useChatModels } from '../../../shared/composables/useChatModels'
import PersonaManagerModal from './PersonaManagerModal.vue'

interface Model {
  id: string
  name: string
}

interface Agent {
  id: string
  name: string
  description?: string
  systemPrompt?: string
  isCustom?: boolean
}

const props = defineProps<{
  models: readonly Model[]
  agents: readonly Agent[]
  selectedModel: Model
  selectedAgent: Agent
}>()

const emit = defineEmits<{
  selectModel: [id: string]
  selectAgent: [id: string]
}>()

const { createCustomAgent, updateCustomAgent, deleteCustomAgent, getCustomAgents } = useChatModels()

const showPersonaManager = ref(false)
const showCreateForm = ref(false)
const customAgents = getCustomAgents()

const newPersona = reactive({
  name: '',
  description: '',
  systemPrompt: ''
})

const createPersona = () => {
  if (newPersona.name.trim()) {
    const agent = createCustomAgent({
      name: newPersona.name.trim(),
      description: newPersona.description.trim(),
      systemPrompt: newPersona.systemPrompt.trim()
    })

    // Reset form
    newPersona.name = ''
    newPersona.description = ''
    newPersona.systemPrompt = ''
    showCreateForm.value = false

    // Select the new agent
    emit('selectAgent', agent.id)
  }
}

const cancelCreate = () => {
  newPersona.name = ''
  newPersona.description = ''
  newPersona.systemPrompt = ''
  showCreateForm.value = false
}

const editPersona = (agent: any) => {
  // For now, just show an alert - could be expanded to edit modal
  alert(`แก้ไขตัวละคร: ${agent.name}\nฟีเจอร์นี้ยังไม่ได้ implement เต็มรูปแบบ`)
}

const confirmDeletePersona = (agentId: string) => {
  if (confirm('คุณต้องการลบตัวละครนี้หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
    deleteCustomAgent(agentId)
  }
}
</script>
