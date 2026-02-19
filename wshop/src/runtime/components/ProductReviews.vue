<script setup lang="ts">
import { useReviews } from '~/composables/useReviews'
import ReviewSummary from './reviews/ReviewSummary.vue'
import ReviewFilters from './reviews/ReviewFilters.vue'
import ReviewList from './reviews/ReviewList.vue'
import ReviewForm from './reviews/ReviewForm.vue'
import ReviewImageModal from './reviews/ReviewImageModal.vue'
import type { Review, ReviewStats } from '#shared/types'

interface Props {
  productId: string
}

const props = defineProps<Props>()

const {
  reviews,
  reviewStats,
  loading,
  processing,
  loadReviews,
  loadReviewStats,
  createReview,
  markReviewHelpful,
  reportReview
} = useReviews()

const sortBy = ref('most_recent')
const filterRating = ref('')
const showVerifiedOnly = ref(false)
const showReviewForm = ref(false)
const showImageModal = ref(false)
const selectedImage = ref('')

const filteredReviews = computed(() => {
  let filtered = [...reviews.value]

  // Filter by rating
  if (filterRating.value) {
    filtered = filtered.filter(review => review.rating === Number(filterRating.value))
  }

  // Filter by verified only
  if (showVerifiedOnly.value) {
    filtered = filtered.filter(review => review.isVerified)
  }

  // Sort
  switch (sortBy.value) {
    case 'highest_rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'lowest_rating':
      filtered.sort((a, b) => a.rating - b.rating)
      break
    case 'most_helpful':
      filtered.sort((a, b) => b.helpful - a.helpful)
      break
    case 'most_recent':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return filtered
})

const submitReview = async (data: {
  rating: number
  title: string
  content: string
  images: string[]
}) => {
  try {
    await createReview({
      productId: props.productId,
      rating: data.rating,
      title: data.title,
      content: data.content,
      images: data.images
    })
    
    closeReviewForm()
    await Promise.all([
      loadReviews(parseInt(props.productId)),
      loadReviewStats(parseInt(props.productId))
    ])
  } catch (_error) {
    // Error handling is done in the composable
  }
}

const closeReviewForm = () => {
  showReviewForm.value = false
}

const markHelpful = async (reviewId: string) => {
  try {
    await markReviewHelpful(reviewId)
  } catch (_error) {
    // Error handling is done in the composable
  }
}

const reportReviewHandler = async (reviewId: string) => {
  if (confirm('คุณต้องการรายงานรีวิวนี้ใช่หรือไม่?')) {
    try {
      await reportReview(reviewId)
    } catch (_error) {
      // Error handling is done in the composable
    }
  }
}

const openImageModal = (image: string) => {
  selectedImage.value = image
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}

onMounted(async () => {
  await Promise.all([
    loadReviews(parseInt(props.productId)),
    loadReviewStats(parseInt(props.productId))
  ])
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">รีวิวสินค้า</h2>
      <button
        @click="showReviewForm = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <NuxtIcon name="i-mdi-message-outline" class="w-4 h-4 inline mr-2" />
        เขียนรีวิว
      </button>
    </div>

    <!-- Review Summary -->
    <ReviewSummary :review-stats="reviewStats" class="mb-8" />

    <!-- Filter and Sort -->
    <ReviewFilters
      v-model:sort-by="sortBy"
      v-model:filter-rating="filterRating"
      v-model:show-verified-only="showVerifiedOnly"
      class="mb-6"
    />

    <!-- Reviews List -->
    <ReviewList
      :reviews="filteredReviews"
      @mark-helpful="markHelpful"
      @report="reportReviewHandler"
      @write-review="showReviewForm = true"
    />

    <!-- Review Form Modal -->
    <ReviewForm
      :show="showReviewForm"
      :processing="processing"
      @close="closeReviewForm"
      @submit="submitReview"
    />

    <!-- Image Modal -->
    <ReviewImageModal
      :show="showImageModal"
      :image="selectedImage"
      @close="closeImageModal"
    />
  </div>
</template>
