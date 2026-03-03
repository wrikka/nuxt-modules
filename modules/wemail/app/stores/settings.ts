export const useSettingsStore = defineStore('settings', () => {
  const density = ref<'comfortable' | 'compact'>('comfortable')
  const notificationsEnabled = ref(true)

  return {
    density,
    notificationsEnabled,
  }
})
