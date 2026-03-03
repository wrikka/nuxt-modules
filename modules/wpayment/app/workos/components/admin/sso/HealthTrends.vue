<script setup lang="ts">
import type { TrendDay } from "./types"

const props = defineProps<{
  trend: TrendDay[]
}>()

const { getHealthClass } = useSSOFormatters()
</script>

<template>
  <div class="health-trends">
    <h3>Health Trends (Last 7 Days)</h3>
    <div class="trends-chart">
      <div class="chart-y-axis">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
      <div class="chart-area">
        <div
          v-for="(day, index) in trend"
          :key="index"
          class="chart-column"
        >
          <div
            class="chart-bar"
            :style="{ height: `${day.health}%` }"
            :class="getHealthClass(day.health)"
          ></div>
          <span class="chart-label">{{ day.day }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-trends {
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.health-trends h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.trends-chart {
  display: flex;
  gap: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
  padding: 0.5rem 0;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  height: 150px;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  margin-top: auto;
}

.chart-bar.excellent {
  background: #10b981;
}

.chart-bar.good {
  background: #3b82f6;
}

.chart-bar.warning {
  background: #f59e0b;
}

.chart-bar.critical {
  background: #dc2626;
}

.chart-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
