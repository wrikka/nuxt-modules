export const useStarred = () => {
  const fetchOptions = {
    params: { starred: true },
    key: 'starred',
  }

  const emptyState = {
    icon: 'mdi:star',
    title: 'No starred messages',
    message: "Stars are for messages that you want to remember. They'll appear here.",
  }

  return {
    fetchOptions,
    emptyState,
  }
}
