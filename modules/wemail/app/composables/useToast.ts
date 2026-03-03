import type { Ref } from 'vue'
import type { Toast } from '../../shared/types/toast'

const toasts: Ref<Toast[]> = ref([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    toasts.value.push({ id, ...toast })
    setTimeout(() => {
      remove(id)
    }, 3000)
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    add,
    remove,
  }
}
