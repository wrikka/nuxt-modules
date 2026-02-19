import { computed, ref } from "vue";
export function useReviewsState() {
  const reviews = ref([]);
  const reviewStats = ref({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    }
  });
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const averageRating = computed(() => reviewStats.value.averageRating);
  const totalReviews = computed(() => reviewStats.value.totalReviews);
  const ratingDistribution = computed(() => reviewStats.value.ratingDistribution);
  return {
    reviews,
    reviewStats,
    loading,
    processing,
    error,
    averageRating,
    totalReviews,
    ratingDistribution
  };
}
