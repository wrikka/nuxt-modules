<script setup>
defineProps({
  member: { type: null, required: true },
  getTierBadgeClass: { type: Function, required: true },
  getTierName: { type: Function, required: true },
  getStatusClass: { type: Function, required: true },
  getStatusText: { type: Function, required: true }
});
const emit = defineEmits(["view", "adjustPoints", "suspend", "delete"]);
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("th-TH");
};
const getTransactionText = (transaction) => {
  switch (transaction.type) {
    case "earned":
      return `+${transaction.points} \u0E04\u0E30\u0E41\u0E19\u0E19`;
    case "redeemed":
      return `-${transaction.points} \u0E04\u0E30\u0E41\u0E19\u0E19`;
    case "expired":
      return `-${transaction.points} \u0E04\u0E30\u0E41\u0E19\u0E19 (\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38)`;
    default:
      return `${transaction.points} \u0E04\u0E30\u0E41\u0E19\u0E19`;
  }
};
</script>

<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <span class="text-blue-600 font-medium">{{ member.name.charAt(0).toUpperCase() }}</span>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
            <span
              :class="[
  'px-2 py-1 text-xs font-medium rounded-full',
  getTierBadgeClass(member.tierId)
]"
            >
              {{ getTierName(member.tierId) }}
            </span>
            <span
              :class="[
  'px-2 py-1 text-xs font-medium rounded-full',
  getStatusClass(member.status)
]"
            >
              {{ getStatusText(member.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-600">{{ member.email }}</p>
          <p class="text-sm text-gray-600">{{ member.phone }}</p>
          
          <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">คะแนนสะสม:</span>
              <div class="font-medium">{{ member.currentPoints.toLocaleString() }}</div>
            </div>
            <div>
              <span class="text-gray-500">สมาชิกเมื่อ:</span>
              <div class="font-medium">{{ formatDate(member.joinDate) }}</div>
            </div>
          </div>

          <!-- Transaction History -->
          <div class="mt-3">
            <h4 class="text-sm font-medium text-gray-700 mb-2">ประวัติคะแนนล่าสุด</h4>
            <div class="space-y-1">
              <div
                v-for="transaction in member.recentTransactions"
                :key="transaction.id"
                class="flex justify-between text-sm"
              >
                <span :class="transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'">
                  {{ getTransactionText(transaction) }}
                </span>
                <span class="text-gray-500">{{ formatDate(transaction.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          @click="$emit('view', member)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="ดูรายละเอียด"
        >
          <Icon name="mdi:eye" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('adjustPoints', member)"
          class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          title="ปรับคะแนน"
        >
          <Icon name="mdi:plus-circle" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('suspend', member)"
          :class="[
  'p-2 rounded-lg',
  member.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'
]"
          :title="member.status === 'suspended' ? '\u0E40\u0E1B\u0E34\u0E14\u0E23\u0E30\u0E07\u0E31\u0E1A' : '\u0E23\u0E30\u0E07\u0E31\u0E1A'"
        >
          <Icon name="mdi:power" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', member)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="ลบสมาชิก"
        >
          <Icon name="mdi:delete" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
