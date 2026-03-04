<script setup lang="ts">
interface Validator {
  name: string
  validate: () => boolean
  message: string
}

const props = defineProps<{
  validators: Validator[]
}>()

const isVisible = ref(false)
const results = ref<{ name: string; passed: boolean; message: string }[]>([])

const runChecks = () => {
  results.value = props.validators.map(v => ({
    name: v.name,
    passed: v.validate(),
    message: v.message
  }))
}

const passedCount = computed(() => results.value.filter(r => r.passed).length)
const totalCount = computed(() => results.value.length)

onMounted(() => {
  runChecks()
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'c' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      isVisible.value = !isVisible.value
    }
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed left-4 top-4 z-[9999] w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
  >
    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Health Check</h3>
      <div class="flex items-center gap-2">
        <span :class="passedCount === totalCount ? 'text-green-600' : 'text-yellow-600'" class="text-sm">
          {{ passedCount }}/{{ totalCount }}
        </span>
        <button class="text-gray-400 hover:text-gray-600" @click="isVisible = false">
          <span class="i-lucide-x size-4" />
        </button>
      </div>
    </div>
    
    <div class="space-y-2">
      <div
        v-for="result in results"
        :key="result.name"
        class="flex items-center gap-2 rounded-lg p-2"
        :class="result.passed ? 'bg-green-50' : 'bg-red-50'"
      >
        <span
          :class="result.passed ? 'i-lucide-check-circle text-green-600' : 'i-lucide-x-circle text-red-600'"
          class="size-5"
        />
        <div class="flex-1">
          <p class="text-sm font-medium" :class="result.passed ? 'text-green-700' : 'text-red-700'">
            {{ result.name }}
          </p>
          <p v-if="!result.passed" class="text-xs text-red-600">{{ result.message }}</p>
        </div>
      </div>
    </div>
    
    <button class="mt-3 w-full rounded-lg bg-gray-100 py-2 text-sm hover:bg-gray-200" @click="runChecks">
      Run Checks Again
    </button>
  </div>
</template>
