<template>
  <div class="plugin-manager bg-white rounded-lg shadow-lg">
    <div class="flex items-center justify-between p-4 border-b">
      <h3 class="font-medium flex items-center gap-2">
        <Icon name="mdi:puzzle" class="w-5 h-5" />
        ปลั๊กอิน ({{ enabledPlugins.length }}/{{ plugins.length }})
      </h3>
      <button
        @click="showAddModal = true"
        class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
      >
        <Icon name="mdi:plus" class="w-4 h-4" />
        เพิ่ม
      </button>
    </div>

    <div class="p-4 space-y-3">
      <div
        v-for="plugin in plugins"
        :key="plugin.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
            <Icon :name="plugin.icon || 'mdi:puzzle'" class="w-5 h-5" />
          </div>
          <div>
            <div class="font-medium flex items-center gap-2">
              {{ plugin.name }}
              <span class="text-xs px-1.5 py-0.5 bg-gray-200 rounded">v{{ plugin.version }}</span>
            </div>
            <div class="text-xs text-gray-500">{{ plugin.description }}</div>
            <div class="text-xs text-gray-400">โดย {{ plugin.author }}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="togglePlugin(plugin.id)"
            :class="['relative w-12 h-6 rounded-full transition-colors', plugin.isEnabled ? 'bg-green-500' : 'bg-gray-300']"
          >
            <span
              :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-transform', plugin.isEnabled ? 'left-7' : 'left-1']"
            />
          </button>
          <button
            @click="uninstallPlugin(plugin.id)"
            class="p-2 hover:bg-red-100 rounded-lg text-red-500"
          >
            <Icon name="mdi:delete" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="plugins.length === 0" class="text-center text-gray-400 py-8">
        ยังไม่มีปลั๊กอิน
      </div>
    </div>

    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showAddModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.stop>
        <h3 class="text-lg font-medium mb-4">เพิ่มปลั๊กอิน</h3>

        <div class="space-y-3">
          <div>
            <label class="text-sm text-gray-600 block mb-1">วางโค้ดปลั๊กอิน (JSON)</label>
            <textarea
              v-model="pluginCode"
              placeholder='{ "name": "My Plugin", ... }'
              class="w-full px-3 py-2 border rounded-lg h-32 font-mono text-sm"
            />
          </div>

          <div class="text-xs text-gray-500">
            หรือเลือกจากรายการ:
          </div>

          <div class="flex gap-2 flex-wrap">
            <button
              v-for="preset in pluginPresets"
              :key="preset.name"
              @click="loadPreset(preset)"
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            @click="importPluginCode"
            :disabled="!pluginCode.trim()"
            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            นำเข้า
          </button>
          <button
            @click="showAddModal = false"
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
import { ref } from 'vue'
import { usePlugins } from '../../../../wcomposables/packages/composables/src/chat/usePlugins'

const { plugins, enabledPlugins, registerPlugin, enablePlugin, disablePlugin, uninstallPlugin, importPlugin } = usePlugins()

const showAddModal = ref(false)
const pluginCode = ref('')

const pluginPresets = [
  { name: 'Dark Mode', code: '{"name":"Auto Dark","description":"Auto switch to dark mode","version":"1.0","author":"System"}' },
  { name: 'Read Receipts', code: '{"name":"Read Receipts","description":"Show when messages are read","version":"1.0","author":"System"}' },
  { name: 'Quick Reply', code: '{"name":"Quick Reply","description":"Add quick reply templates","version":"1.0","author":"System"}' }
]

const togglePlugin = (pluginId: string) => {
  const plugin = plugins.value.find(p => p.id === pluginId)
  if (plugin?.isEnabled) {
    disablePlugin(pluginId)
  } else {
    enablePlugin(pluginId)
  }
}

const loadPreset = (preset: { code: string }) => {
  pluginCode.value = preset.code
}

const importPluginCode = () => {
  try {
    const plugin = importPlugin(pluginCode.value)
    if (plugin) {
      pluginCode.value = ''
      showAddModal.value = false
    }
  } catch (error) {
    alert('โค้ดปลั๊กอินไม่ถูกต้อง')
  }
}
</script>
