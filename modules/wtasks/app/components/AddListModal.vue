<script setup lang="ts">
const emit = defineEmits(['close']);
const { addList: addListApi } = useListApi();
const newList = ref({ label: '', icon: 'mdi:format-list-bulleted' });

function addList() {
  if (newList.value.label.trim()) {
    addListApi({ ...newList.value });
    emit('close');
  }
}
</script>

<template>
  <Modal title="Add New List" ~/close="emit('close')">
    <div class="space-y-4">
      <div>
        <label for="list-name" class="block text-sm font-medium text-muted-foreground">List Name</label>
        <Input id="list-name" v-model="newList.label" class="mt-1" placeholder="Enter list name" />
      </div>
      <div>
        <label for="list-icon" class="block text-sm font-medium text-muted-foreground">Icon</label>
        <Input id="list-icon" v-model="newList.icon" class="mt-1" />
        <p class="mt-1 text-xs text-muted-foreground">Use any icon from Material Design Icons (e.g., mdi:home).</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="ghost" ~/click="emit('close')">Cancel</Button>
        <Button ~/click="addList">Add List</Button>
      </div>
    </template>
  </Modal>
</template>
