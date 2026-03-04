<template>
  <div class="code-runner bg-gray-900 rounded-lg overflow-hidden">
    <div class="flex items-center justify-between p-2 bg-gray-800">
      <select v-model="selectedLanguage" class="bg-gray-700 text-white text-sm rounded px-2 py-1">
        <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
          {{ lang.name }}
        </option>
      </select>
      <button
        @click="runCode"
        :disabled="isExecuting || !code.trim()"
        class="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
      >
        <Icon :name="isExecuting ? 'mdi:loading' : 'mdi:play'" class="w-4 h-4" :class="{ 'animate-spin': isExecuting }" />
        {{ isExecuting ? 'กำลังรัน...' : 'รันโค้ด' }}
      </button>
    </div>

    <textarea
      v-model="code"
      placeholder="วางโค้ดที่นี่..."
      class="w-full h-32 p-3 bg-gray-900 text-green-400 font-mono text-sm resize-none outline-none"
      spellcheck="false"
    />

    <div v-if="currentExecution" class="border-t border-gray-700">
      <div class="p-2 bg-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <span>ผลลัพธ์ ({{ currentExecution.executionTime.toFixed(0) }}ms)</span>
        <button @click="clearCurrentExecution" class="text-gray-500 hover:text-white">
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
      </div>
      <pre
        :class="['p-3 font-mono text-sm overflow-x-auto', currentExecution.error ? 'text-red-400' : 'text-green-400']"
      >{{ currentExecution.error || currentExecution.output }}</pre>
    </div>

    <div v-if="executionHistory.length > 0" class="border-t border-gray-700 p-2">
      <div class="text-xs text-gray-500 mb-2">ประวัติการรัน</div>
      <div class="space-y-1 max-h-24 overflow-y-auto">
        <div
          v-for="exec in executionHistory.slice(0, 5)"
          :key="exec.id"
          @click="loadExecution(exec)"
          class="text-xs p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
        >
          <div class="flex items-center justify-between">
            <span :class="exec.error ? 'text-red-400' : 'text-green-400'">
              {{ exec.language }} - {{ exec.error ? 'Error' : 'Success' }}
            </span>
            <span class="text-gray-500">{{ formatTime(exec.executedAt) }}</span>
          </div>
          <div class="text-gray-400 truncate">{{ exec.code.slice(0, 50) }}...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCodeExecution } from '../../../../wcomposables/packages/composables/src/chat/useCodeExecution'
import type { CodeExecutionResult } from '../../../../wcomposables/packages/composables/src/chat/useCodeExecution'

const { isExecuting, executionHistory, currentExecution, supportedLanguages, executeCode, clearCurrentExecution } = useCodeExecution()

const code = ref('')
const selectedLanguage = ref('javascript')

const runCode = async () => {
  await executeCode(code.value, selectedLanguage.value)
}

const loadExecution = (exec: CodeExecutionResult) => {
  code.value = exec.code
  selectedLanguage.value = exec.language
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script>
