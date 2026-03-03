import { ref, onMounted } from 'vue'
import type { WhiteboardDoc } from '~/../shared/types/whiteboard'

export function useCustomTemplates() {
  const customTemplates = ref<Array<{ id: string; name: string; doc: WhiteboardDoc }>>([])
  const storageKey = 'whiteboard_custom_templates'

  const loadTemplates = () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          customTemplates.value = parsed
        }
      } catch (e) {
        console.error('Failed to parse custom templates from localStorage', e)
      }
    }
  }

  const saveTemplate = (doc: WhiteboardDoc) => {
    const name = prompt('Enter a name for your template:', 'My Template')
    if (name) {
      const newTemplate = {
        id: `custom-${Date.now()}`,
        name,
        doc,
      }
      customTemplates.value.push(newTemplate)
      localStorage.setItem(storageKey, JSON.stringify(customTemplates.value))
    }
  }

  onMounted(loadTemplates)

  return { customTemplates, saveTemplate, loadTemplates }
}
