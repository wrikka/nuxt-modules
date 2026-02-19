<script setup lang="ts">
const { isSidebarOpen, toggleSidebar } = useSidebar();
const { state: modalState, close: closeModal } = useModal();

function handleConfirm() {
	if (modalState.value?.onConfirm) {
		modalState.value.onConfirm();
	}
	closeModal();
}
const { state: contextMenuState, isOpen: isContextMenuOpen } = useContextMenu();
</script>

<template>
  <div class="flex h-screen bg-background text-foreground overflow-hidden">
    <Toaster rich-colors position="top-right" />

    <!-- Sidebar -->
    <aside
      :class="[
        'flex-shrink-0 border-r border-border p-4 flex flex-col transition-width duration-300',
        isSidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <Sidebar />
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="p-4 lg:hidden">
        <button ~/click="toggleSidebar" class="text-muted-foreground hover:text-foreground">
          <Icon name="mdi:menu" size="24" />
        </button>
      </header>
      <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
        <NuxtPage />
      </main>
    </div>

    <!-- Modals and Context Menus -->
    <CreateTaskModal v-if="modalState?.name === 'createTask'" ~/close="closeModal" />
    <EditTaskModal v-else-if="modalState?.name === 'editTask' && modalState.task" :task="modalState.task" ~/close="closeModal" />
    <ListSettingsModal v-else-if="modalState?.name === 'listSettings' && modalState.list" :list="modalState.list" ~/close="closeModal" />
    <AddListModal v-else-if="modalState?.name === 'addList'" ~/close="closeModal" />
    <ConfirmationDialog
      v-else-if="modalState?.name === 'deleteTask' && modalState.task"
      title="Delete Task"
      :message="`Are you sure you want to delete task #${modalState.task.id}? This action cannot be undone.`"
      ~/cancel="closeModal"
      ~/confirm="handleConfirm"
    />
    <ConfirmationDialog
      v-else-if="modalState?.name === 'deleteList' && modalState.list"
      title="Delete List"
      :message="`Are you sure you want to delete the list '${modalState.list.label}'? This will also delete all tasks within this list.`"
      ~/cancel="closeModal"
      ~/confirm="handleConfirm"
    />
    <ContextMenu
      v-if="contextMenuState"
      v-model="isContextMenuOpen"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :options="contextMenuState.options"
    />
  </div>
</template>
