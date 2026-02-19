export function useReviewsUtils(reviews, averageRating, totalReviews, ratingDistribution) {
  const getReviewById = (reviewId) => {
    return reviews.value.find((review) => review.id === reviewId);
  };
  const getReviewsByRating = (rating) => {
    return reviews.value.filter((review) => review.rating === rating);
  };
  const getVerifiedReviews = () => {
    return reviews.value.filter((review) => review.isVerified);
  };
  const getRecentReviews = (limit = 10) => {
    return reviews.value.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, limit);
  };
  const getTopRatedReviews = (limit = 10) => {
    return reviews.value.sort((a, b) => b.rating - a.rating).slice(0, limit);
  };
  const getMostHelpfulReviews = (limit = 10) => {
    return reviews.value.sort((a, b) => b.helpful - a.helpful).slice(0, limit);
  };
  const calculateAverageRating = (reviewList) => {
    if (reviewList.length === 0) return 0;
    const sum = reviewList.reduce((total, review) => total + review.rating, 0);
    return sum / reviewList.length;
  };
  const getRatingDistribution = (reviewList) => {
    const distribution = {
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0,
      "1": 0
    };
    reviewList.forEach((review) => {
      const ratingKey = String(review.rating);
      if (ratingKey in distribution) {
        distribution[ratingKey]++;
      }
    });
    return distribution;
  };
  const searchReviews = (query) => {
    if (!query.trim()) return reviews.value;
    const searchTerm = query.toLowerCase();
    return reviews.value.filter(
      (review) => review.title?.toLowerCase().includes(searchTerm) || review.content?.toLowerCase().includes(searchTerm)
    );
  };
  const getReviewSummary = () => {
    return {
      averageRating: averageRating.value,
      totalReviews: totalReviews.value,
      ratingDistribution: ratingDistribution.value,
      verifiedCount: getVerifiedReviews().length,
      pendingCount: reviews.value.filter((r) => !r.isVerified).length
    };
  };
  return {
    getReviewById,
    getReviewsByRating,
    getVerifiedReviews,
    getRecentReviews,
    getTopRatedReviews,
    getMostHelpfulReviews,
    calculateAverageRating,
    getRatingDistribution,
    searchReviews,
    getReviewSummary
  };
}
