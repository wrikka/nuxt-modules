<script setup lang="ts">
import type { Label } from '../../../shared/types/label';

definePageMeta({
  layout: 'settings'
})

const { data: labels, refresh: refreshLabels } = useFetch<Label[]>('/api/labels')

const allRules = computed(() => {
  if (!labels.value) return []
  return labels.value.flatMap(label => 
    (label.conditions || []).map(condition => ({ ...condition, labelName: label.name, labelIcon: label.icon }))
  )
})

const router = useRouter()

const editLabel = (labelName: string) => {
  router.push(`/settings/labels?edit=${labelName}`)
}

const deleteRule = async (labelName: string, conditionValue: string) => {
  const label = labels.value?.find(l => l.name === labelName)
  if (!label || !label.conditions) return

  const conditionIndex = label.conditions.findIndex(c => c.value === conditionValue)
  if (conditionIndex === -1) return

  label.conditions.splice(conditionIndex, 1)

  await $fetch('/api/labels', {
    method: 'PATCH',
    body: {
      originalName: labelName,
      updatedLabel: label
    }
  })
  await refreshLabels()
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Manage Rules</h1>
        <p class="text-gray-500 dark:text-zinc-400">View and manage all your auto-labeling rules in one place.</p>
      </div>
    </div>

    <UCard>
      <template v-if="allRules.length">
        <div class="divide-y divide-gray-200 dark:divide-zinc-800">
          <div v-for="(rule, index) in allRules" :key="index" class="flex items-center justify-between p-4">
            <div class="flex items-center gap-4">
              <Icon name="mdi:robot-outline" class="text-2xl text-gray-500" />
              <div>
                <div class="font-mono text-sm">
                  <span class="capitalize font-semibold">{{ rule.field }}</span>
                  <span class="text-gray-500 mx-1">{{ rule.operator }}</span>
                  <span class="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">{{ rule.value }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Applies label: 
                  <NuxtLink :to="'/settings/labels'" class="font-semibold hover:underline">
                    <Icon :name="rule.labelIcon || 'mdi:tag'" class="-mt-0.5" /> {{ rule.labelName }}
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UButton @click="editLabel(rule.labelName)" variant="ghost" color="gray" icon="i-heroicons-pencil-square" />
              <UButton @click="deleteRule(rule.labelName, rule.value)" variant="ghost" color="red" icon="i-heroicons-trash" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-center py-8">
          <Icon name="mdi:robot-off-outline" class="text-5xl text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold">No Rules Found</h3>
          <p class="text-gray-500">You haven't set up any auto-labeling rules yet.</p>
          <UButton to="/settings/labels" label="Create a Rule" class="mt-4" />
        </div>
      </template>
    </UCard>
  </div>
</template>
