<script setup lang="ts">
import type { LoyaltyTier } from '~~/shared/types'

defineProps<{
  tiers: LoyaltyTier[]
}>()
</script>

<template>
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">ระดับสมาชิก</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        :class="[
          'border rounded-lg p-4',
          tier.isCurrent ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium text-gray-900">{{ tier.name }}</h4>
          <span
            v-if="tier.isCurrent"
            class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
          >
            ระดับปัจจุบัน
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-3">{{ tier.description }}</p>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>คะแนนสะสม:</span>
            <span class="font-medium">{{ tier.pointsMultiplier }}x</span>
          </div>
          <div class="flex justify-between">
            <span>ส่วนลด:</span>
            <span class="font-medium">{{ tier.discount }}%</span>
          </div>
          <div class="flex justify-between">
            <span>คะแนนสะสม:</span>
            <span class="font-medium">{{ tier.pointsPerBaht }} คะแนน/บาท</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
