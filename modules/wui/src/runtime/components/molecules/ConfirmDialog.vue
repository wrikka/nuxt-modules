<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'danger'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const variantClasses = {
  danger: 'bg-red-600 hover:bg-red-500',
  warning: 'bg-amber-600 hover:bg-amber-500',
  info: 'bg-blue-600 hover:bg-blue-500'
}

onKeyStroke('Escape', () => emit('cancel'))
onKeyStroke('Enter', () => emit('confirm'))
</script>

<template>
  <MoleculesDialog @close="emit('cancel')">
    <template #header>
      <h2 class="text-lg font-semibold">
        {{ title }}
      </h2>
    </template>

    <p class="text-sm text-muted-foreground">
      {{ message }}
    </p>

    <template #footer>
      <div class="flex justify-end gap-3">
        <AtomsButton
          variant="ghost"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </AtomsButton>
        <AtomsButton
          :class="variantClasses[variant]"
          class="text-white"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </AtomsButton>
      </div>
    </template>
  </MoleculesDialog>
</template>
