<script setup lang="ts">
import { provide, reactive, computed } from 'vue'

interface ValidationError {
  field: string
  message: string
}

interface Props {
  initialValues?: Record<string, unknown>
  validate?: (values: Record<string, unknown>) => ValidationError[]
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>
}

const _props = withDefaults(defineProps<Props>(), {
  initialValues: () => ({})
})

const emit = defineEmits<{
  submit: [values: Record<string, unknown>]
  error: [errors: ValidationError[]]
}>()

const values = reactive<Record<string, unknown>>({ ..._props.initialValues })
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const isSubmitting = reactive({ value: false })

const hasErrors = computed(() => Object.keys(errors).length > 0)

const setValue = (field: string, value: unknown) => {
  values[field] = value
  if (errors[field]) {
    delete errors[field]
  }
}

const setTouched = (field: string) => {
  touched[field] = true
}

const validateField = (field: string, value: unknown): string | null => {
  if (_props.validate) {
    const validationErrors = _props.validate({ [field]: value })
    const fieldError = validationErrors.find(e => e.field === field)
    return fieldError?.message || null
  }
  return null
}

const validateForm = (): boolean => {
  Object.keys(errors).forEach(key => delete errors[key])

  if (_props.validate) {
    const validationErrors = _props.validate({ ...values })
    validationErrors.forEach(error => {
      errors[error.field] = error.message
    })
  }

  return Object.keys(errors).length === 0
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  Object.keys(values).forEach(key => setTouched(key))

  if (!validateForm()) {
    emit('error', Object.entries(errors).map(([field, message]) => ({ field, message })))
    return
  }

  isSubmitting.value = true

  try {
    if (_props.onSubmit) {
      await _props.onSubmit({ ...values })
    }
    emit('submit', { ...values })
  }
  finally {
    isSubmitting.value = false
  }
}

provide('form', {
  values,
  errors,
  touched,
  isSubmitting: computed(() => isSubmitting.value),
  setValue,
  setTouched,
  validateField
})
</script>

<template>
  <form @submit="handleSubmit">
    <slot
      :values="values"
      :errors="errors"
      :touched="touched"
      :is-submitting="isSubmitting.value"
      :has-errors="hasErrors"
    />
  </form>
</template>
