<script setup lang="ts">
import type { StockAlert } from '#shared/types';
import { useStock } from '../../composables/inventory/useStock';
import { useStockAlertUtils } from '../../composables/inventory/useStockAlertUtils';

const { stockAlerts, markAlertAsRead } = useStock()
const {
  getAlertIcon,
  getSeverityColor,
  getSeverityLabel,
  formatTime,
  getAlertStats,
  getUnreadAlerts
} = useStockAlertUtils()

const unreadAlerts = computed(() => getUnreadAlerts(stockAlerts.value))
const alertStats = computed(() => getAlertStats(stockAlerts.value))

const handleMarkAsRead = async (alertId: string) => {
  try {
    await markAlertAsRead(alertId)
  } catch (error) {
    console.error('Failed to mark alert as read:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    for (const alert of unreadAlerts.value) {
      await markAlertAsRead(alert.id)
    }
  } catch (error) {
    console.error('Failed to mark all alerts as read:', error)
  }
}

</script>

<template>

  <div class="bg-white rounded-lg shadow-sm">
    <!-- Header -->
    <div class="p-6 border-b">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <AlertTriangle class="w-6 h-6 text-orange-600 mr-2" />
          <h2 class="text-xl font-semibold">แจ้งเตือนสต็อก</h2>
          <span v-if="alertStats.unread > 0" class="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
            {{ alertStats.unread }} ใหม่
          </span>
        </div>
        <button
          v-if="unreadAlerts.length > 0"
          @click="handleMarkAllAsRead"
          class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="p-6 border-b bg-gray-50">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ alertStats.total }}</div>
          <div class="text-sm text-gray-600">ทั้งหมด</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ alertStats.critical }}</div>
          <div class="text-sm text-gray-600">วิกฤต</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ alertStats.high }}</div>
          <div class="text-sm text-gray-600">สูง</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ alertStats.medium }}</div>
          <div class="text-sm text-gray-600">ปานกลาง</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ alertStats.low }}</div>
          <div class="text-sm text-gray-600">ต่ำ</div>
        </div>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="divide-y">
      <div
        v-for="alert in stockAlerts.slice(0, 10)"
        :key="alert.id"
        :class="[
          'p-4 hover:bg-gray-50 transition-colors',
          !alert.isRead && 'bg-blue-50'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start flex-1">
            <component 
              :is="getAlertIcon(alert.alertType)"
              class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0"
              :class="alert.severity === 'critical' ? 'text-red-600' : 'text-orange-600'"
            />
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <h3 class="font-medium text-gray-900">{{ alert.productName }}</h3>
                <span 
                  :class="[
                    'ml-2 px-2 py-1 text-xs rounded-full border',
                    getSeverityColor(alert.severity)
                  ]"
                >
                  {{ getSeverityLabel(alert.severity) }}
                </span>
                <span v-if="!alert.isRead" class="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ alert.message }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <Package class="w-4 h-4 mr-1" />
                <span>สต็อกปัจจุบัน: {{ alert.currentStock }}</span>
                <span class="mx-2">•</span>
                <span>สต็อกขั้นต่ำ: {{ alert.minStock }}</span>
                <span class="mx-2">•</span>
                <span>{{ formatTime(alert.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center ml-4">
            <button
              v-if="!alert.isRead"
              @click="handleMarkAsRead(alert.id)"
              class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="ทำเครื่องหมายว่าอ่านแล้ว"
            >
              <Check class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="stockAlerts.length === 0" class="p-8 text-center text-gray-500">
      <AlertTriangle class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>ไม่มีการแจ้งเตือนสต็อกในขณะนี้</p>
    </div>

    <!-- View All Link -->
    <div v-if="stockAlerts.length > 10" class="p-4 border-t bg-gray-50">
      <button class="w-full text-center text-blue-600 hover:text-blue-800 transition-colors">
        ดูการแจ้งเตือนทั้งหมด ({{ stockAlerts.length }})
      </button>
    </div>
  </div>

</template>
