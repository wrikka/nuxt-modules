import { readonly, ref } from 'vue'

export interface SkeletonState {
  isLoading: boolean
  itemCount: number
}

/**
 * Skeleton Loading - Show skeleton placeholders while loading
 */
export function useSkeletonLoading() {
  const state = ref<SkeletonState>({
    isLoading: false,
    itemCount: 5
  })

  const showSkeleton = (itemCount = 5) => {
    state.value = { isLoading: true, itemCount }
  }

  const hideSkeleton = () => {
    state.value.isLoading = false
  }

  const setLoading = (loading: boolean) => {
    state.value.isLoading = loading
  }

  return {
    state: readonly(state),
    showSkeleton,
    hideSkeleton,
    setLoading
  }
}
