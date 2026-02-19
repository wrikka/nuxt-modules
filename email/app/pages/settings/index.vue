<script setup lang="ts">
definePageMeta({
  layout: 'settings'
})

const _colorMode = useColorMode()

const settingsStore = useSettingsStore()
const { density, notificationsEnabled } = storeToRefs(settingsStore)

const _showShortcuts = ref(false)

const densities: { value: 'comfortable' | 'compact', text: string }[] = [
  {
    value: 'comfortable',
    text: 'Comfortable'
  },
  {
    value: 'compact',
    text: 'Compact'
  }
]

const _themes = [
  {
    value: 'system',
    icon: 'i-carbon-computer',
    text: 'System'
  },
  {
    value: 'light',
    icon: 'i-carbon-sun',
    text: 'Light'
  },
  {
    value: 'dark',
    icon: 'i-carbon-moon',
    text: 'Dark'
  }
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">General Settings</h1>

    <div class="space-y-8">
      <div>
        <h2 class="text-lg font-semibold mb-2">Appearance</h2>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Select the theme for the application.</p>
        <div class="flex items-center space-x-2">
          <button
            v-for="theme in _themes"
            :key="theme.value"
            @click="_colorMode.preference = theme.value"
            class="flex items-center justify-center w-24 h-12 rounded-md border transition-colors"
            :class="[
              _colorMode.preference === theme.value
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            ]"
          >
            <Icon :name="theme.icon" class="w-5 h-5 mr-2" />
            <span>{{ theme.text }}</span>
          </button>
        </div>
      </div>

      <!-- Email Density -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Email Density</h2>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Choose how compact the email list appears.</p>
        <div class="flex items-center space-x-2">
          <button
            v-for="item in densities"
            :key="item.value"
            @click="density = item.value"
            class="flex items-center justify-center w-32 h-12 rounded-md border transition-colors"
            :class="[
              density === item.value
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            ]"
          >
            <span>{{ item.text }}</span>
          </button>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Keyboard Shortcuts</h2>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">View all available keyboard shortcuts.</p>
        <UButton @click="_showShortcuts = true" label="Show Shortcuts" variant="outline" />
      </div>

      <!-- Notifications -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Desktop Notifications</h2>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-zinc-400">Enable or disable desktop notifications.</p>
          <UToggle v-model="notificationsEnabled" />
        </div>
      </div>
    </div>

    <!-- Shortcuts Modal -->
    <UModal v-model="_showShortcuts">
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold">Keyboard Shortcuts</h2>
        </template>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">c</span><span>Compose new email</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">/</span><span>Search</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">r</span><span>Reply</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">a</span><span>Reply all</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">f</span><span>Forward</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">e</span><span>Archive</span></div>
          <div class="flex justify-between items-center"><span class="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">#</span><span>Delete</span></div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton @click="_showShortcuts = false">Close</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
