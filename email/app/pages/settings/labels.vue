<script setup lang="ts">
definePageMeta({
  layout: 'settings'
})

import type { Label, LabelCondition } from '../../../shared/types/label';

const { data: _labels, refresh: _refreshLabels } = useFetch<Label[]>('/api/labels')

// Modal state
const _isModalOpen = ref(false)
const _selectedLabel = ref<Label | null>(null)
const _originalLabelName = ref<string | null>(null)
const _isEditMode = ref(false)

// New condition state
const _newCondition = ref<LabelCondition>({ field: 'from', operator: 'contains', value: '' })
const _conditionFields: LabelCondition['field'][] = ['from', 'to', 'subject', 'body']
const _conditionOperators: LabelCondition['operator'][] = ['contains', 'not-contains', 'equals', 'starts-with', 'ends-with']

onMounted(() => {
  const route = useRoute()
  const labelToEdit = route.query.edit
  if (labelToEdit && _labels.value) {
    const label = _labels.value.find(l => l.name === labelToEdit)
    if (label) {
      _openEditModal(label)
    }
  }
})

const _openCreateModal = () => {
  _isEditMode.value = false
  _selectedLabel.value = { name: '', icon: 'mdi:tag', conditions: [] }
  _isModalOpen.value = true
}

const _openEditModal = (label: Label) => {
  _isEditMode.value = true
  _selectedLabel.value = JSON.parse(JSON.stringify(label)) // Deep copy
  _originalLabelName.value = label.name
  if (!_selectedLabel.value) return
  if (!_selectedLabel.value.conditions) {
    _selectedLabel.value.conditions = []
  }
  _isModalOpen.value = true
}

const _createLabel = async () => {
  if (!_selectedLabel.value || _selectedLabel.value.name.trim() === '') return
  await $fetch('/api/labels', {
    method: 'POST',
    body: _selectedLabel.value
  })
  await _refreshLabels()
  _isModalOpen.value = false
}

const _saveLabel = async () => {
  if (_isEditMode.value) {
    await _updateLabel()
  } else {
    await _createLabel()
  }
}

const _updateLabel = async () => {
  if (!_selectedLabel.value || !_originalLabelName.value) return
  await $fetch('/api/labels', { 
    method: 'PATCH', 
    body: { 
      originalName: _originalLabelName.value,
      updatedLabel: _selectedLabel.value
    } 
  })
  await _refreshLabels()
  _isModalOpen.value = false
}

const _deleteLabel = async (labelName: string) => {
  await $fetch('/api/labels', { method: 'DELETE', body: { name: labelName } })
  await _refreshLabels()
  if (_isModalOpen.value) {
    _isModalOpen.value = false
  }
}

const _addCondition = () => {
  if (!_selectedLabel.value || !_newCondition.value.value.trim()) return
  if (!_selectedLabel.value.conditions) {
    _selectedLabel.value.conditions = []
  }
  _selectedLabel.value.conditions.push({ ..._newCondition.value })
  _newCondition.value = { field: 'from', operator: 'contains', value: '' }
}

const _removeCondition = (index: number) => {
  _selectedLabel.value?.conditions?.splice(index, 1)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Manage Labels</h1>

    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-500 dark:text-zinc-400">Create and manage labels to organize your emails.</p>
      <UButton @click="_openCreateModal()" label="Add New Label" icon="i-heroicons-plus" />
    </div>

    <div class="space-y-4">
      <UCard v-for="label in _labels" :key="label.name">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon :name="label.icon || 'mdi:tag'" class="text-2xl text-gray-500" />
            <div>
              <span class="font-medium">{{ label.name }}</span>
              <div v-if="label.conditions && label.conditions.length" class="text-xs text-gray-500">
                {{ label.conditions.length }} auto-labeling rule(s)
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton @click="_openEditModal(label)" variant="ghost" color="gray" icon="i-heroicons-pencil-square" />
            <UButton @click="_deleteLabel(label.name)" variant="ghost" color="red" icon="i-heroicons-trash" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Edit Label Modal -->
    <UModal v-model="_isModalOpen">
      <UCard v-if="_selectedLabel">
        <template #header>
          <h2 class="text-xl font-bold">{{ _isEditMode ? 'Edit Label' : 'Create New Label' }}</h2>
        </template>

        <div class="space-y-6">
          <!-- Label Name and Icon -->
          <div>
            <label class="block text-sm font-medium mb-1">Label Name</label>
            <UInput v-model="_selectedLabel.name" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Icon (e.g., mdi:tag)</label>
            <UInput v-model="_selectedLabel.icon" />
          </div>

          <!-- Conditions -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Rules for Auto-Labeling</h3>
            <div class="space-y-2 mb-4">
              <div v-for="(condition, index) in _selectedLabel.conditions" :key="index" class="flex items-center gap-2 p-2 bg-gray-100 dark:bg-zinc-800 rounded-md">
                <span class="capitalize text-sm font-mono">{{ condition.field }}</span>
                <span class="text-sm text-gray-500">{{ condition.operator }}</span>
                <span class="font-mono text-sm bg-white dark:bg-zinc-700 px-2 py-1 rounded">{{ condition.value }}</span>
                <div class="flex-grow"></div>
                <UButton @click="_removeCondition(index)" color="red" variant="link" icon="i-heroicons-x-circle" size="xs" />
              </div>
              <p v-if="!_selectedLabel.conditions || !_selectedLabel.conditions.length" class="text-sm text-gray-500">No rules defined.</p>
            </div>

            <!-- Add New Condition Form -->
            <form @submit.prevent="_addCondition" class="p-3 border dark:border-zinc-700 rounded-md space-y-3">
              <h4 class="font-semibold">Add a new rule</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <USelect v-model="_newCondition.field" :options="_conditionFields" />
                <USelect v-model="_newCondition.operator" :options="_conditionOperators" />
                <UInput v-model="_newCondition.value" placeholder="Value" class="sm:col-span-3" />
              </div>
              <UButton type="submit" label="Add Rule" size="sm" />
            </form>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton @click="_isModalOpen = false" color="gray">Cancel</UButton>
            <UButton @click="_saveLabel">{{ _isEditMode ? 'Save Changes' : 'Create Label' }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>
