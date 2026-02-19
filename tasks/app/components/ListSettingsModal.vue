<script setup lang="ts">
import { ref } from 'vue';
import type { List } from '~/shared/types/list';

const props = defineProps<{ list: List }>();
const emit = defineEmits(['close']);

const { updateList } = useListApi();
const updatedList = ref({ ...props.list });

function saveSettings() {
  updateList(updatedList.value);
  emit('close');
}
</script>

<template>
  <Modal title="List Settings" ~/close="emit('close')">
    <div class="space-y-4">
      <div>
        <label for="list-name" class="block text-sm font-medium text-muted-foreground">List Name</label>
        <Input id="list-name" v-model="updatedList.label" class="mt-1" />
      </div>
      <div>
        <label for="list-icon" class="block text-sm font-medium text-muted-foreground">Icon</label>
        <Input id="list-icon" v-model="updatedList.icon" class="mt-1" />
        <p class="mt-1 text-xs text-muted-foreground">Use any icon from Material Design Icons (e.g., mdi:home).</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="ghost" ~/click="emit('close')">Cancel</Button>
        <Button ~/click="saveSettings">Save</Button>
      </div>
    </template>
  </Modal>
</template>
