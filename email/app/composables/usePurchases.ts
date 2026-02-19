export const usePurchases = () => {
  const fetchOptions = {
    params: { folder: 'purchases' },
    key: 'purchases',
  }

  const emptyState = {
    icon: 'mdi:cart-outline',
    title: 'No Purchases',
    message: 'Emails related to your purchases will appear here.',
  }

  return {
    fetchOptions,
    emptyState,
  }
}
