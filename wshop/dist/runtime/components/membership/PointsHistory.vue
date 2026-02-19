<script setup>
const props = defineProps({
  points: { type: Array, required: true },
  loading: { type: Boolean, required: false }
});
const getPointIcon = (type) => {
  switch (type) {
    case "earned":
      return "lucide:trending-up";
    case "redeemed":
      return "lucide:trending-down";
    case "expired":
      return "lucide:clock";
    default:
      return "lucide:gift";
  }
};
const getPointColor = (type) => {
  switch (type) {
    case "earned":
      return "text-green-600 bg-green-50";
    case "redeemed":
      return "text-red-600 bg-red-50";
    case "expired":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-blue-600 bg-blue-50";
  }
};
const getPointLabel = (type) => {
  switch (type) {
    case "earned":
      return "\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A";
    case "redeemed":
      return "\u0E43\u0E0A\u0E49\u0E41\u0E25\u0E49\u0E27";
    case "expired":
      return "\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38";
    default:
      return "\u0E2D\u0E37\u0E48\u0E19\u0E46";
  }
};
const formatPoints = (points) => {
  const formatted = new Intl.NumberFormat("th-TH").format(Math.abs(points));
  return points >= 0 ? `+${formatted}` : `-${formatted}`;
};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const totalEarned = computed(() => {
  return props.points.filter((p) => p.type === "earned").reduce((sum, p) => sum + p.points, 0);
});
const totalRedeemed = computed(() => {
  return props.points.filter((p) => p.type === "redeemed").reduce((sum, p) => sum + p.points, 0);
});
const currentBalance = computed(() => {
  return totalEarned.value - totalRedeemed.value;
});
const sortedPoints = computed(() => {
  return [...props.points].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <!-- Header -->
    <div class="p-6 border-b">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">ประวัติแต้มสะสม</h3>
        <div class="text-right">
          <div class="text-2xl font-bold text-blue-600">
            {{ new Intl.NumberFormat("th-TH").format(currentBalance) }}
          </div>
          <div class="text-sm text-gray-600">แต้มคงเหลือ</div>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="p-6 border-b bg-gray-50">
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-lg font-bold text-green-600">
            +{{ new Intl.NumberFormat("th-TH").format(totalEarned) }}
          </div>
          <div class="text-sm text-gray-600">ได้รับทั้งหมด</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-red-600">
            -{{ new Intl.NumberFormat("th-TH").format(totalRedeemed) }}
          </div>
          <div class="text-sm text-gray-600">ใช้ไปทั้งหมด</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-bold text-blue-600">
            {{ new Intl.NumberFormat("th-TH").format(currentBalance) }}
          </div>
          <div class="text-sm text-gray-600">คงเหลือ</div>
        </div>
      </div>
    </div>

    <!-- Points List -->
    <div class="divide-y">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="sortedPoints.length === 0" class="p-8 text-center text-gray-500">
        <Gift class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>ยังไม่มีประวัติการทำรายการแต้ม</p>
      </div>

      <div
        v-else
        v-for="point in sortedPoints.slice(0, 20)"
        :key="point.id"
        class="p-4 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-1">
            <div 
              :class="[
  'p-2 rounded-lg mr-3',
  getPointColor(point.type)
]"
            >
              <component :is="getPointIcon(point.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ point.description }}</h4>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <span>{{ formatDate(point.createdAt) }}</span>
                <span v-if="point.orderId" class="ml-2">• ออเดอร์ #{{ point.orderId.slice(-8) }}</span>
                <span v-if="point.expiresAt" class="ml-2">• หมดอายุ {{ formatDate(point.expiresAt) }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div 
              :class="[
  'text-lg font-bold',
  point.type === 'earned' ? 'text-green-600' : point.type === 'redeemed' ? 'text-red-600' : 'text-gray-600'
]"
            >
              {{ formatPoints(point.points) }}
            </div>
            <div class="text-sm text-gray-500">{{ getPointLabel(point.type) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- View All Link -->
    <div v-if="sortedPoints.length > 20" class="p-4 border-t bg-gray-50">
      <button class="w-full text-center text-blue-600 hover:text-blue-800 transition-colors">
        ดูประวัติทั้งหมด ({{ sortedPoints.length }})
      </button>
    </div>
  </div>
</template>
