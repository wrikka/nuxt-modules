import type { NavItem } from '@nuxt/content'

export function useDocsNavigation() {
  const { data: navigation } = useAsyncData('navigation', () => {
    return queryCollection('navigation').find()
  })

  const currentPath = computed(() => useRoute().path)

  const currentItem = computed(() => {
    return navigation.value?.find((item: NavItem) => item.path === currentPath.value)
  })

  const findPrevNext = () => {
    if (!navigation.value) return { prev: null, next: null }

    const currentIndex = navigation.value.findIndex((item: NavItem) => item.path === currentPath.value)
    return {
      prev: currentIndex > 0 ? navigation.value[currentIndex - 1] : null,
      next: currentIndex < navigation.value.length - 1 ? navigation.value[currentIndex + 1] : null
    }
  }

  return {
    navigation: readonly(navigation),
    currentItem: readonly(currentItem),
    findPrevNext
  }
}
