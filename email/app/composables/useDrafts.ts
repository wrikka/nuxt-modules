export const useDrafts = () => {
  const fetchOptions = {
    params: { folder: 'drafts' },
    key: 'drafts',
  }

  const emptyState = {
    icon: 'mdi:file-document-outline',
    title: 'No drafts',
    message: 'You have no saved drafts.',
  }

  return {
    fetchOptions,
    emptyState,
  }
}
