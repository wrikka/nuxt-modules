<script setup>
const props = defineProps({
  membership: { type: null, required: true },
  tier: { type: null, required: false },
  showDetails: { type: Boolean, required: false, default: true }
});
const getTierIcon = (tier) => {
  switch (tier) {
    case "bronze":
      return "lucide:trophy";
    case "silver":
      return "lucide:star";
    case "gold":
      return "lucide:crown";
    case "platinum":
      return "lucide:gem";
    default:
      return "lucide:star";
  }
};
const getTierColor = (tier) => {
  switch (tier) {
    case "bronze":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "silver":
      return "text-gray-600 bg-gray-50 border-gray-200";
    case "gold":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "platinum":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};
const getTierLabel = (tier) => {
  switch (tier) {
    case "bronze":
      return "\u0E1A\u0E23\u0E2D\u0E19\u0E0B\u0E4C";
    case "silver":
      return "\u0E0B\u0E34\u0E25\u0E40\u0E27\u0E2D\u0E23\u0E4C";
    case "gold":
      return "\u0E42\u0E01\u0E25\u0E14\u0E4C";
    case "platinum":
      return "\u0E41\u0E1E\u0E25\u0E15\u0E34\u0E19\u0E31\u0E21";
    default:
      return "\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B";
  }
};
const formatPoints = (points) => {
  return new Intl.NumberFormat("th-TH").format(points);
};
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  }).format(amount);
};
const joinDate = computed(() => {
  return new Date(props.membership.joinDate).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});
const lastActivity = computed(() => {
  const now = /* @__PURE__ */ new Date();
  const last = new Date(props.membership.lastActivity);
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49";
  if (diffDays === 1) return "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E19";
  if (diffDays < 7) return `${diffDays} \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} \u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  return `${Math.floor(diffDays / 30)} \u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
    <!-- Header -->
    <div :class="['p-6 border-b', getTierColor(membership.tier)]">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon 
            :name="getTierIcon(membership.tier)"
            class="w-8 h-8 mr-3"
          />
          <div>
            <h3 class="text-xl font-bold">สมาชิก{{ getTierLabel(membership.tier) }}</h3>
            <p class="text-sm opacity-75">รหัสสมาชิก: #{{ membership.id.slice(-8) }}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">{{ formatPoints(membership.points) }}</div>
          <div class="text-sm">แต้มสะสม</div>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div v-if="showDetails" class="p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ formatCurrency(membership.totalSpent) }}
          </div>
          <div class="text-sm text-gray-600">ยอดซื้อรวม</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ tier?.discountRate || 0 }}%
          </div>
          <div class="text-sm text-gray-600">ส่วนลดสมาชิก</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ tier?.pointMultiplier || 1 }}x
          </div>
          <div class="text-sm text-gray-600">คูณแต้ม</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-gray-900">
            {{ membership.benefits.length }}
          </div>
          <div class="text-sm text-gray-600">สิทธิพิเศษ</div>
        </div>
      </div>

      <!-- Benefits -->
      <div v-if="tier?.benefits.length" class="mb-6">
        <h4 class="font-medium text-gray-900 mb-3">สิทธิพิเศษ</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="benefit in tier.benefits"
            :key="benefit"
            class="flex items-center text-sm text-gray-600"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {{ benefit }}
          </div>
        </div>
      </div>

      <!-- Activity Info -->
      <div class="border-t pt-4">
        <div class="flex justify-between text-sm text-gray-600">
          <div>
            <span class="font-medium">วันที่เป็นสมาชิก:</span>
            {{ joinDate }}
          </div>
          <div>
            <span class="font-medium">ใช้งานล่าสุด:</span>
            {{ lastActivity }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
