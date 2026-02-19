<script setup lang="ts">
const sidebarStore = useSidebarStore()
const modalStore = useModalStore()
const { isSnoozeModalOpen: _isSnoozeModalOpen, selectedEmail: _selectedEmail } = storeToRefs(modalStore)
const { isSidebarOpen: _isSidebarOpen } = storeToRefs(sidebarStore)
const route = useRoute()

const isMobile = ref(false)

onMounted(() => {
  const checkDevice = () => {
    isMobile.value = window.innerWidth < 768
  }

  checkDevice()
  window.addEventListener('resize', checkDevice)

  // Sidebar should be open by default on desktop
  if (!isMobile.value) {
    sidebarStore.isSidebarOpen = true
  }

  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
  })
})

// Close sidebar on route change on mobile
watch(route, () => {
  if (isMobile.value) {
    sidebarStore.isSidebarOpen = false
  }
})
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-200 font-sans">
    <div class="max-w-screen-2xl mx-auto flex-1 flex flex-col w-full bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative">
      <ToastProvider />
      <AppHeader />
      <div class="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main class="flex-1 overflow-y-auto">
          <slot />
        </main>
      </div>
      <ContextMenu />
      <SnoozeModal v-if="_isSnoozeModalOpen && _selectedEmail" :email="_selectedEmail" @close="modalStore.closeSnoozeModal()" />

      <!-- Mobile sidebar backdrop -->
      <div
        v-if="_isSidebarOpen && isMobile"
        class="fixed inset-0 bg-black/30 z-10 md:hidden"
        @click="sidebarStore.isSidebarOpen = false"
      />
    </div>
  </div>
</template>
