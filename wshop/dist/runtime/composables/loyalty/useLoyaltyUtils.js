export const useLoyaltyUtils = () => {
  const defaultTiers = [
    { id: 1, name: "Silver", minPoints: 0, benefits: [], color: "#9CA3AF" },
    { id: 2, name: "Gold", minPoints: 1e3, benefits: [], color: "#F59E0B" },
    { id: 3, name: "Platinum", minPoints: 5e3, benefits: [], color: "#8B5CF6" }
  ];
  const getTierBadgeClass = (tierId, tiers = defaultTiers) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return "bg-gray-100 text-gray-800";
    switch (tier.name) {
      case "Silver":
        return "bg-gray-100 text-gray-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getTierName = (tierId, tiers = defaultTiers) => {
    const tier = tiers.find((t) => t.id === tierId);
    return tier?.name || "Unknown";
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48";
      case "inactive":
        return "\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19";
      case "suspended":
        return "\u0E23\u0E30\u0E07\u0E31\u0E1A";
      default:
        return status;
    }
  };
  const getTierByPoints = (points, tiers = defaultTiers) => {
    const sortedTiers = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
    return sortedTiers.find((tier) => points >= tier.minPoints) || sortedTiers[sortedTiers.length - 1] || null;
  };
  const getNextTier = (currentTierId, tiers = defaultTiers) => {
    const currentTier = tiers.find((t) => t.id === currentTierId);
    if (!currentTier) return null;
    const sortedTiers = [...tiers].sort((a, b) => a.minPoints - b.minPoints);
    const currentIndex = sortedTiers.findIndex((t) => t.id === currentTierId);
    return currentIndex < sortedTiers.length - 1 ? sortedTiers[currentIndex + 1] : null;
  };
  const getPointsToNextTier = (currentPoints, currentTierId, tiers = defaultTiers) => {
    const nextTier = getNextTier(currentTierId, tiers);
    if (!nextTier) return 0;
    return Math.max(0, nextTier.minPoints - currentPoints);
  };
  return {
    defaultTiers,
    getTierBadgeClass,
    getTierName,
    getStatusClass,
    getStatusText,
    getTierByPoints,
    getNextTier,
    getPointsToNextTier
  };
};
