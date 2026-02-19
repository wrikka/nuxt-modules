<script setup lang="ts">
import { ref, computed } from '#imports';
import type { ExperimentSummary, VariantSummary, SignificanceLevel } from '#feature-flags/types';

const experiments = ref<ExperimentSummary[]>([]);
const isLoading = ref(false);
const selectedExperiments = ref<string[]>([]);
const dateRange = ref<'last7days' | 'last30days' | 'last90days'>('last30days');

const loadExperiments = () => {
  isLoading.value = true;

  setTimeout(() => {
    experiments.value = [
      {
        id: 'exp-1',
        key: 'checkout-flow',
        name: 'Checkout Flow Redesign',
        status: 'running',
        startDate: Date.now() - 14 * 24 * 3600000,
        variants: [
          { key: 'control', name: 'Control', allocation: 50, users: 5234, conversions: 892, conversionRate: 17.0, confidence: 0, lift: 0 },
          { key: 'variant-a', name: 'New Design', allocation: 50, users: 5189, conversions: 1037, conversionRate: 20.0, confidence: 95.2, lift: 17.6 },
        ],
        metrics: [
          { key: 'conversion', name: 'Conversion Rate', type: 'primary', baseline: 17.0, bestVariant: 'variant-a', improvement: 17.6 },
        ],
        significance: 'high',
        winner: 'variant-a',
      },
      {
        id: 'exp-2',
        key: 'pricing-page',
        name: 'Pricing Page Layout',
        status: 'running',
        startDate: Date.now() - 7 * 24 * 3600000,
        variants: [
          { key: 'control', name: 'Control', allocation: 50, users: 2341, conversions: 187, conversionRate: 8.0, confidence: 0, lift: 0 },
          { key: 'variant-a', name: 'Simplified', allocation: 50, users: 2298, conversions: 207, conversionRate: 9.0, confidence: 78.4, lift: 12.5 },
        ],
        metrics: [
          { key: 'conversion', name: 'Conversion Rate', type: 'primary', baseline: 8.0, bestVariant: 'variant-a', improvement: 12.5 },
        ],
        significance: 'medium',
      },
      {
        id: 'exp-3',
        key: 'onboarding',
        name: 'Onboarding Flow',
        status: 'completed',
        startDate: Date.now() - 30 * 24 * 3600000,
        endDate: Date.now() - 7 * 24 * 3600000,
        variants: [
          { key: 'control', name: 'Control', allocation: 50, users: 8923, conversions: 2677, conversionRate: 30.0, confidence: 0, lift: 0 },
          { key: 'variant-a', name: 'Guided Tour', allocation: 50, users: 8856, conversions: 3099, conversionRate: 35.0, confidence: 99.8, lift: 16.7 },
        ],
        metrics: [
          { key: 'completion', name: 'Completion Rate', type: 'primary', baseline: 30.0, bestVariant: 'variant-a', improvement: 16.7 },
        ],
        significance: 'conclusive',
        winner: 'variant-a',
      },
    ];

    isLoading.value = false;
  }, 500);
};

const getSignificanceColor = (level: SignificanceLevel) => {
  const colors: Record<SignificanceLevel, string> = {
    none: '#9ca3af',
    low: '#f59e0b',
    medium: '#3b82f6',
    high: '#10b981',
    conclusive: '#059669',
  };
  return colors[level];
};

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    running: 'background: #dbeafe; color: #1d4ed8',
    completed: 'background: #d1fae5; color: #059669',
    paused: 'background: #fef3c7; color: #d97706',
    draft: 'background: #e5e7eb; color: #374151',
  };
  return styles[status] || '';
};

const toggleCompare = (id: string) => {
  const index = selectedExperiments.value.indexOf(id);
  if (index === -1 && selectedExperiments.value.length < 3) {
    selectedExperiments.value.push(id);
  } else {
    selectedExperiments.value.splice(index, 1);
  }
};

const overallStats = computed(() => {
  const running = experiments.value.filter((e) => e.status === 'running').length;
  const completed = experiments.value.filter((e) => e.status === 'completed').length;
  const totalUsers = experiments.value.reduce((sum, e) => sum + e.variants.reduce((s, v) => s + v.users, 0), 0);
  return { running, completed, totalUsers };
});
</script>

<template>
  <div class="ab-container">
    <div class="ab-header">
      <h3>A/B Test Dashboard</h3>
      <div class="ab-header-actions">
        <select v-model="dateRange" class="ab-select">
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
          <option value="last90days">Last 90 days</option>
        </select>
        <button
          class="ab-btn ab-btn-sm"
          :disabled="isLoading"
          @click="loadExperiments"
        >
          {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="experiments.length === 0 && !isLoading" class="ab-empty">
      <button class="ab-btn ab-btn-primary" @click="loadExperiments">
        Load Experiments
      </button>
    </div>

    <template v-else>
      <div class="ab-stats">
        <div class="ab-stat">
          <span class="ab-stat-value">{{ overallStats.running }}</span>
          <span class="ab-stat-label">Running</span>
        </div>
        <div class="ab-stat">
          <span class="ab-stat-value">{{ overallStats.completed }}</span>
          <span class="ab-stat-label">Completed</span>
        </div>
        <div class="ab-stat">
          <span class="ab-stat-value">{{ (overallStats.totalUsers / 1000).toFixed(1) }}k</span>
          <span class="ab-stat-label">Total Users</span>
        </div>
      </div>

      <div v-if="selectedExperiments.length > 0" class="ab-compare-bar">
        <span>{{ selectedExperiments.length }} experiments selected for comparison</span>
        <button class="ab-btn ab-btn-sm ab-btn-primary">Compare</button>
      </div>

      <div class="ab-experiments">
        <div
          v-for="exp in experiments"
          :key="exp.id"
          class="ab-experiment"
          :class="{ 'ab-selected': selectedExperiments.includes(exp.id) }"
          @click="toggleCompare(exp.id)"
        >
          <div class="ab-exp-header">
            <div class="ab-exp-title">
              <span class="ab-exp-name">{{ exp.name }}</span>
              <span class="ab-exp-status" :style="getStatusBadge(exp.status)">
                {{ exp.status }}
              </span>
            </div>
            <div class="ab-exp-significance">
              <div
                class="ab-significance-bar"
                :style="{
                  background: getSignificanceColor(exp.significance),
                  width: exp.significance === 'conclusive' ? '100%' : exp.significance === 'high' ? '80%' : exp.significance === 'medium' ? '60%' : '40%'
                }"
              />
              <span class="ab-significance-label">{{ exp.significance }}</span>
            </div>
          </div>

          <div class="ab-exp-variants">
            <div
              v-for="variant in exp.variants"
              :key="variant.key"
              class="ab-variant"
              :class="{ 'ab-winner': exp.winner === variant.key }"
            >
              <div class="ab-variant-header">
                <span class="ab-variant-name">{{ variant.name }}</span>
                <span v-if="exp.winner === variant.key" class="ab-winner-badge">Winner</span>
              </div>
              <div class="ab-variant-stats">
                <div class="ab-variant-stat">
                  <span class="ab-variant-value">{{ variant.users.toLocaleString() }}</span>
                  <span class="ab-variant-label">Users</span>
                </div>
                <div class="ab-variant-stat">
                  <span class="ab-variant-value">{{ variant.conversionRate }}%</span>
                  <span class="ab-variant-label">Conv. Rate</span>
                </div>
                <div v-if="variant.lift > 0" class="ab-variant-stat ab-lift">
                  <span class="ab-variant-value">+{{ variant.lift }}%</span>
                  <span class="ab-variant-label">Lift</span>
                </div>
              </div>
              <div v-if="variant.confidence > 0" class="ab-confidence">
                {{ variant.confidence }}% confidence
              </div>
            </div>
          </div>

          <div class="ab-exp-meta">
            <span>Started {{ new Date(exp.startDate).toLocaleDateString() }}</span>
            <span v-if="exp.winner">Winner: {{ exp.variants.find(v => v.key === exp.winner)?.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ab-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.ab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ab-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.ab-header-actions {
  display: flex;
  gap: 0.5rem;
}

.ab-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.ab-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.ab-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.ab-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ab-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ab-empty {
  text-align: center;
  padding: 2rem;
}

.ab-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.ab-stat {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
}

.ab-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.ab-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.ab-compare-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #dbeafe;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.ab-experiments {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ab-experiment {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ab-experiment:hover {
  border-color: #3b82f6;
}

.ab-experiment.ab-selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.ab-exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.ab-exp-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ab-exp-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.ab-exp-status {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.ab-exp-significance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ab-significance-bar {
  width: 60px;
  height: 4px;
  border-radius: 2px;
}

.ab-significance-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
}

.ab-exp-variants {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.ab-variant {
  background: #f9fafb;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.ab-variant.ab-winner {
  background: #d1fae5;
}

.ab-variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.375rem;
}

.ab-variant-name {
  font-size: 0.75rem;
  font-weight: 500;
}

.ab-winner-badge {
  font-size: 0.625rem;
  background: #10b981;
  color: white;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.ab-variant-stats {
  display: flex;
  gap: 0.75rem;
}

.ab-variant-stat {
  display: flex;
  flex-direction: column;
}

.ab-variant-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.ab-variant-label {
  font-size: 0.625rem;
  color: #6b7280;
}

.ab-lift .ab-variant-value {
  color: #10b981;
}

.ab-confidence {
  font-size: 0.625rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.ab-exp-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
