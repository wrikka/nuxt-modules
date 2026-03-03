<script setup lang="ts">
import { ref, computed } from '#imports';
import type { SimulationConfig, SimulationResult, SegmentDistribution } from '#feature-flags/types';

const props = defineProps<{
  flagKey: string;
}>();

const config = ref<SimulationConfig>({
  percentage: 50,
  stickiness: 'userId',
  sampleSize: 1000,
});

const isSimulating = ref(false);
const result = ref<SimulationResult | null>(null);

const runSimulation = () => {
  isSimulating.value = true;

  setTimeout(() => {
    const enabledCount = Math.round(config.value.sampleSize * (config.value.percentage / 100));
    const disabledCount = config.value.sampleSize - enabledCount;

    const segments: SegmentDistribution[] = [
      { segment: 'US', enabled: Math.round(enabledCount * 0.4), disabled: Math.round(disabledCount * 0.4), percentage: 40 },
      { segment: 'EU', enabled: Math.round(enabledCount * 0.3), disabled: Math.round(disabledCount * 0.3), percentage: 30 },
      { segment: 'APAC', enabled: Math.round(enabledCount * 0.2), disabled: Math.round(disabledCount * 0.2), percentage: 20 },
      { segment: 'Other', enabled: Math.round(enabledCount * 0.1), disabled: Math.round(disabledCount * 0.1), percentage: 10 },
    ];

    result.value = {
      enabledCount,
      disabledCount,
      distributionBySegment: segments,
      consistency: 99.7,
      edgeCases: [
        { type: 'boundary', description: 'User at exactly 50% boundary', userId: 'user_123', expectedEnabled: true, actualEnabled: true },
      ],
    };

    isSimulating.value = false;
  }, 600);
};

const chartData = computed(() => {
  if (!result.value) return [];
  return result.value.distributionBySegment.map((s) => ({
    label: s.segment,
    enabled: s.enabled,
    disabled: s.disabled,
  }));
});
</script>

<template>
  <div class="rs-container">
    <div class="rs-header">
      <h3>Rollout Simulator</h3>
      <span class="rs-flag-key">{{ flagKey }}</span>
    </div>

    <div class="rs-config">
      <div class="rs-field">
        <label>Rollout Percentage</label>
        <div class="rs-slider-container">
          <input
            v-model.number="config.percentage"
            type="range"
            min="0"
            max="100"
            step="5"
            class="rs-slider"
          />
          <span class="rs-slider-value">{{ config.percentage }}%</span>
        </div>
      </div>

      <div class="rs-field">
        <label>Stickiness</label>
        <select v-model="config.stickiness" class="rs-select">
          <option value="userId">User ID</option>
          <option value="sessionId">Session ID</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div class="rs-field">
        <label>Sample Size</label>
        <input
          v-model.number="config.sampleSize"
          type="number"
          min="100"
          max="100000"
          step="100"
          class="rs-input"
        />
      </div>
    </div>

    <button
      class="rs-btn rs-btn-primary"
      :disabled="isSimulating"
      @click="runSimulation"
    >
      {{ isSimulating ? 'Simulating...' : 'Run Simulation' }}
    </button>

    <div v-if="result" class="rs-results">
      <div class="rs-summary">
        <div class="rs-stat rs-enabled">
          <span class="rs-stat-value">{{ result.enabledCount.toLocaleString() }}</span>
          <span class="rs-stat-label">Enabled</span>
        </div>
        <div class="rs-stat rs-disabled">
          <span class="rs-stat-value">{{ result.disabledCount.toLocaleString() }}</span>
          <span class="rs-stat-label">Disabled</span>
        </div>
        <div class="rs-stat">
          <span class="rs-stat-value">{{ result.consistency }}%</span>
          <span class="rs-stat-label">Consistency</span>
        </div>
      </div>

      <div class="rs-chart">
        <h4>Distribution by Segment</h4>
        <div class="rs-bars">
          <div
            v-for="item in chartData"
            :key="item.label"
            class="rs-bar-group"
          >
            <span class="rs-bar-label">{{ item.label }}</span>
            <div class="rs-bar">
              <div
                class="rs-bar-enabled"
                :style="{ width: (item.enabled / (item.enabled + item.disabled)) * 100 + '%' }"
              />
              <div
                class="rs-bar-disabled"
                :style="{ width: (item.disabled / (item.enabled + item.disabled)) * 100 + '%' }"
              />
            </div>
            <span class="rs-bar-counts">
              {{ item.enabled }} / {{ item.disabled }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="result.edgeCases.length > 0" class="rs-edge-cases">
        <h4>Edge Cases</h4>
        <div
          v-for="(edge, i) in result.edgeCases"
          :key="i"
          class="rs-edge-item"
        >
          <span class="rs-edge-type">{{ edge.type }}</span>
          <span class="rs-edge-desc">{{ edge.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rs-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.rs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rs-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.rs-flag-key {
  font-family: monospace;
  font-size: 0.875rem;
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.rs-config {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.rs-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.rs-field label {
  font-size: 0.75rem;
  color: #6b7280;
}

.rs-slider-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rs-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e7eb;
  border-radius: 2px;
}

.rs-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

.rs-slider-value {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 40px;
}

.rs-select,
.rs-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.rs-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.rs-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.rs-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rs-results {
  margin-top: 1.5rem;
}

.rs-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.rs-stat {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.rs-enabled { background: #d1fae5; }
.rs-disabled { background: #fee2e2; }

.rs-stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
}

.rs-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.rs-chart h4 {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
}

.rs-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rs-bar-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rs-bar-label {
  font-size: 0.75rem;
  min-width: 50px;
}

.rs-bar {
  flex: 1;
  height: 20px;
  display: flex;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.rs-bar-enabled {
  background: #10b981;
}

.rs-bar-disabled {
  background: #ef4444;
}

.rs-bar-counts {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 70px;
  text-align: right;
}

.rs-edge-cases {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef3c7;
  border-radius: 0.375rem;
}

.rs-edge-cases h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
}

.rs-edge-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.rs-edge-type {
  background: #fcd34d;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  font-size: 0.625rem;
}
</style>
