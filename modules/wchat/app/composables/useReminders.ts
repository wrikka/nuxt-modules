import type { MessageReminder, ReminderSchedule } from '../types'

// Message Reminders - Set reminders on messages
export const useMessageReminders = () => {
  const config = useRuntimeConfig()
  const reminders = ref<Map<string, MessageReminder[]>>(new Map())
  const isLoading = ref(false)

  // Create reminder
  const createReminder = async (
    messageId: string,
    schedule: ReminderSchedule
  ): Promise<MessageReminder | null> => {
    if (!config.public.wchat?.enableReminders) return null

    const reminder = await $fetch<MessageReminder>('/api/chat/reminders', {
      method: 'POST',
      body: {
        messageId,
        schedule
      }
    })

    const messageReminders = reminders.value.get(messageId) || []
    messageReminders.push(reminder)
    reminders.value.set(messageId, messageReminders)

    return reminder
  }

  // Quick preset reminders
  const remindLaterToday = async (messageId: string): Promise<MessageReminder | null> => {
    const evening = new Date()
    evening.setHours(20, 0, 0, 0)
    return await createReminder(messageId, {
      type: 'once',
      time: evening
    })
  }

  const remindTomorrow = async (messageId: string): Promise<MessageReminder | null> => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return await createReminder(messageId, {
      type: 'once',
      time: tomorrow
    })
  }

  const remindNextWeek = async (messageId: string): Promise<MessageReminder | null> => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(9, 0, 0, 0)
    return await createReminder(messageId, {
      type: 'once',
      time: nextWeek
    })
  }

  const remindCustom = async (
    messageId: string,
    date: Date
  ): Promise<MessageReminder | null> => {
    return await createReminder(messageId, {
      type: 'once',
      time: date
    })
  }

  // List reminders
  const listReminders = async (): Promise<MessageReminder[]> => {
    const data = await $fetch<MessageReminder[]>('/api/chat/reminders')
    // Group by message
    data.forEach(reminder => {
      const messageReminders = reminders.value.get(reminder.messageId) || []
      if (!messageReminders.find(r => r.id === reminder.id)) {
        messageReminders.push(reminder)
        reminders.value.set(reminder.messageId, messageReminders)
      }
    })
    return data
  }

  // Get reminders for message
  const getMessageReminders = (messageId: string): MessageReminder[] => {
    return reminders.value.get(messageId) || []
  }

  // Delete reminder
  const deleteReminder = async (reminderId: string): Promise<void> => {
    await $fetch(`/api/chat/reminders/${reminderId}`, { method: 'DELETE' })

    // Remove from local
    reminders.value.forEach((messageReminders, messageId) => {
      reminders.value.set(
        messageId,
        messageReminders.filter(r => r.id !== reminderId)
      )
    })
  }

  // Mark reminder as done
  const completeReminder = async (reminderId: string): Promise<void> => {
    await $fetch(`/api/chat/reminders/${reminderId}/complete`, { method: 'POST' })
  }

  // Snooze reminder
  const snoozeReminder = async (
    reminderId: string,
    minutes: number
  ): Promise<void> => {
    await $fetch(`/api/chat/reminders/${reminderId}/snooze`, {
      method: 'POST',
      body: { minutes }
    })
  }

  return {
    reminders: readonly(reminders),
    isLoading: readonly(isLoading),
    createReminder,
    remindLaterToday,
    remindTomorrow,
    remindNextWeek,
    remindCustom,
    listReminders,
    getMessageReminders,
    deleteReminder,
    completeReminder,
    snoozeReminder
  }
}

// Quick Replies - Message templates
export const useQuickReplies = () => {
  const config = useRuntimeConfig()
  const templates = useLocalStorage<Array<{
    id: string
    shortcut: string
    text: string
    category?: string
  }>>('wchat:quick-replies', [
    { id: '1', shortcut: 'brb', text: 'Be right back', category: 'common' },
    { id: '2', shortcut: 'omw', text: 'On my way', category: 'common' },
    { id: '3', shortcut: 'ty', text: 'Thank you!', category: 'common' },
    { id: '4', shortcut: 'np', text: 'No problem', category: 'common' }
  ])

  const categories = computed(() => {
    const cats = new Set(templates.value.map(t => t.category || 'general'))
    return Array.from(cats)
  })

  // Add template
  const addTemplate = (shortcut: string, text: string, category?: string): void => {
    templates.value.push({
      id: crypto.randomUUID(),
      shortcut,
      text,
      category
    })
  }

  // Remove template
  const removeTemplate = (id: string): void => {
    templates.value = templates.value.filter(t => t.id !== id)
  }

  // Get template by shortcut
  const getTemplate = (shortcut: string): string | undefined => {
    return templates.value.find(t => t.shortcut === shortcut)?.text
  }

  // Expand shortcut in text
  const expandText = (text: string): string => {
    return text.replace(/\/([a-zA-Z0-9]+)/g, (match, shortcut) => {
      const template = getTemplate(shortcut)
      return template || match
    })
  }

  // Get suggestions based on input
  const getSuggestions = (input: string): typeof templates.value => {
    if (!input.startsWith('/')) return []
    const query = input.substring(1).toLowerCase()
    return templates.value.filter(t =>
      t.shortcut.toLowerCase().startsWith(query) ||
      t.text.toLowerCase().includes(query)
    )
  }

  return {
    templates: readonly(templates),
    categories: readonly(categories),
    addTemplate,
    removeTemplate,
    getTemplate,
    expandText,
    getSuggestions
  }
}
