export const useArchived = () => {
  const fetchOptions = {
    params: { folder: 'archived' },
    key: 'archived',
  }

  const emptyState = {
    icon: 'mdi:archive-outline',
    title: 'No archived messages',
    message: 'Archived messages will appear here.',
  }

  return {
    fetchOptions,
    emptyState,
  }
}
