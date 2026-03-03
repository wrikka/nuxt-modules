export const useSnoozed = () => {
  const fetchOptions = {
    params: { folder: 'snoozed' },
    key: 'snoozed',
  }

  const emptyState = {
    icon: 'mdi:clock-outline',
    title: 'No snoozed messages',
    message: "Messages you've snoozed will appear here.",
  }

  return {
    fetchOptions,
    emptyState,
  }
}
