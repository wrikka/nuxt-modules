<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  changeType: 'neutral',
  loading: false
})

const changeClasses = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-muted-foreground'
}
</script>

<template>
  <AtomsCard>
    <div class="flex items-start justify-between p-6">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          {{ title }}
        </p>
        <div class="flex items-baseline gap-2">
          <AtomsSkeleton v-if="loading" class="h-8 w-24" />
          <span v-else class="text-2xl font-bold">
            {{ value }}
          </span>
        </div>
        <p v-if="change" :class="['text-sm', changeClasses[changeType]]">
          {{ change }}
        </p>
      </div>
      <div
        v-if="icon"
        class="p-3 rounded-lg bg-primary/10 text-primary"
      >
        <span :class="icon" class="w-5 h-5" />
      </div>
    </div>
  </AtomsCard>
</template>
