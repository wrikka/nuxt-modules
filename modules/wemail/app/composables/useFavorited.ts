export const useFavorited = () => {
  const fetchOptions = {
    params: { favorited: true },
    key: 'favorited',
  }

  const emptyState = {
    icon: 'mdi:heart',
    title: 'No favorited messages',
    message: "Favorites are for messages that you want to remember. They'll appear here.",
  }

  return {
    fetchOptions,
    emptyState,
  }
}
