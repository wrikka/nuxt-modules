<template>
  <div class="command-editor">
    <div class="flex items-center justify-between p-4 border-b">
      <h3 class="font-medium flex items-center gap-2">
        <Icon name="mdi:command" class="w-5 h-5" />
        คำสั่งที่กำหนดเอง ({{ customCommands.length }})
      </h3>
      <button
        @click="showCreateForm = true"
        class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
      >
        <Icon name="mdi:plus" class="w-4 h-4" />
        เพิ่มคำสั่ง
      </button>
    </div>

    <div class="p-4 space-y-2">
      <div
        v-for="cmd in customCommands"
        :key="cmd.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            :style="{ backgroundColor: cmd.color }"
          >
            <Icon :name="cmd.icon || 'mdi:command'" class="w-5 h-5" />
          </div>
          <div>
            <div class="font-medium">{{ cmd.command }}</div>
            <div class="text-sm text-gray-500">{{ cmd.description }}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="toggleCommand(cmd.id)"
            :class="['p-2 rounded-lg', cmd.isEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400']"
          >
            <Icon :name="cmd.isEnabled ? 'mdi:check' : 'mdi:close'" class="w-4 h-4" />
          </button>
          <button
            @click="deleteCommand(cmd.id)"
            class="p-2 hover:bg-red-100 rounded-lg text-red-500"
          >
            <Icon name="mdi:delete" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="customCommands.length === 0" class="text-center text-gray-400 py-8">
        ยังไม่มีคำสั่งที่กำหนดเอง
      </div>
    </div>

    <div
      v-if="showCreateForm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showCreateForm = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.stop>
        <h3 class="text-lg font-medium mb-4">สร้างคำสั่งใหม่</h3>

        <div class="space-y-3">
          <div>
            <label class="text-sm text-gray-600 block mb-1">คำสั่ง</label>
            <div class="flex items-center">
              <span class="px-3 py-2 bg-gray-100 border-l border-t border-b rounded-l-lg text-gray-500">/</span>
              <input
                v-model="newCommand.command"
                placeholder="ชื่อคำสั่ง"
                class="flex-1 px-3 py-2 border rounded-r-lg"
              />
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">รายละเอียด</label>
            <input
              v-model="newCommand.description"
              placeholder="อธิบายว่าคำสั่งนี้ทำอะไร"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="text-sm text-gray-600 block mb-1">คำตอบ (template)</label>
            <textarea
              v-model="newCommand.action"
              placeholder="ข้อความที่จะตอบกลับ..."
              class="w-full px-3 py-2 border rounded-lg h-24"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="createCommand"
            :disabled="!canCreate"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            สร้าง
          </button>
          <button
            @click="showCreateForm = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCustomSlashCommands } from '../../../../wcomposables/packages/composables/src/chat/useCustomSlashCommands'

const { customCommands, createCommand: doCreate, deleteCommand, toggleCommand } = useCustomSlashCommands()

const showCreateForm = ref(false)
const newCommand = reactive({
  command: '',
  description: '',
  action: ''
})

const canCreate = computed(() =>
  newCommand.command.trim() &&
  newCommand.description.trim() &&
  newCommand.action.trim()
)

const createCommand = () => {
  if (!canCreate.value) return

  doCreate(
    newCommand.command,
    newCommand.description,
    newCommand.action,
    'mdi:command',
    '#3b82f6'
  )

  newCommand.command = ''
  newCommand.description = ''
  newCommand.action = ''
  showCreateForm.value = false
}
</script>
