<script setup lang="ts">
import { ref, computed } from '#imports';
import type { EnvironmentDiff, FlagEnvDiff, EnvDiffSummary } from '#feature-flags/types';

const environments = ['development', 'staging', 'production'];
const sourceEnv = ref('staging');
const targetEnv = ref('production');
const diffResult = ref<EnvironmentDiff | null>(null);
const isLoading = ref(false);

const compareEnvironments = () => {
  isLoading.value = true;

  setTimeout(() => {
    const flags: FlagEnvDiff[] = [
      {
        key: 'new-dashboard',
        source: { enabled: true, rollout: { percentage: 50, stickiness: 'userId' } },
        target: { enabled: true, rollout: { percentage: 100, stickiness: 'userId' } },
        diffType: 'changed',
        changes: [{ field: 'rollout.percentage', sourceValue: 50, targetValue: 100 }],
      },
      {
        key: 'beta-feature',
        source: { enabled: true },
        target: null,
        diffType: 'removed',
        changes: [],
      },
      {
        key: 'api-v2',
        source: null,
        target: { enabled: false },
        diffType: 'added',
        changes: [],
      },
      {
        key: 'dark-mode',
        source: { enabled: true },
        target: { enabled: true },
        diffType: 'unchanged',
        changes: [],
      },
    ];

    const summary: EnvDiffSummary = {
      totalFlags: 4,
      added: 1,
      removed: 1,
      changed: 1,
      unchanged: 1,
      riskLevel: 'medium',
      warnings: ['Flag "beta-feature" will be removed in production', 'Rollout percentage change may affect all users'],
    };

    diffResult.value = {
      sourceEnv: sourceEnv.value,
      targetEnv: targetEnv.value,
      comparedAt: Date.now(),
      flags,
      summary,
    };

    isLoading.value = false;
  }, 400);
};

const getDiffTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    added: '#10b981',
    removed: '#ef4444',
    changed: '#f59e0b',
    unchanged: '#6b7280',
  };
  return colors[type] || '#6b7280';
};

const getDiffTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    added: '+',
    removed: '-',
    changed: '~',
    unchanged: '=',
  };
  return icons[type] || '•';
};

const getRiskColor = (level: string) => {
  const colors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return colors[level] || '#6b7280';
};
</script>

<template>
  <div class="ed-container">
    <div class="ed-header">
      <h3>Environment Diff</h3>
    </div>

    <div class="ed-selector">
      <div class="ed-env-select">
        <label>Source</label>
        <select v-model="sourceEnv">
          <option v-for="env in environments" :key="env" :value="env">{{ env }}</option>
        </select>
      </div>
      <span class="ed-arrow">→</span>
      <div class="ed-env-select">
        <label>Target</label>
        <select v-model="targetEnv">
          <option v-for="env in environments" :key="env" :value="env">{{ env }}</option>
        </select>
      </div>
      <button
        class="ed-btn ed-btn-primary"
        :disabled="isLoading || sourceEnv === targetEnv"
        @click="compareEnvironments"
      >
        {{ isLoading ? 'Comparing...' : 'Compare' }}
      </button>
    </div>

    <div v-if="diffResult" class="ed-result">
      <div class="ed-summary">
        <div class="ed-risk" :style="{ borderColor: getRiskColor(diffResult.summary.riskLevel) }">
          <span class="ed-risk-label">Risk</span>
          <span class="ed-risk-value" :style="{ color: getRiskColor(diffResult.summary.riskLevel) }">
            {{ diffResult.summary.riskLevel.toUpperCase() }}
          </span>
        </div>

        <div class="ed-stats">
          <div class="ed-stat ed-added">
            <span class="ed-stat-value">{{ diffResult.summary.added }}</span>
            <span class="ed-stat-label">Added</span>
          </div>
          <div class="ed-stat ed-removed">
            <span class="ed-stat-value">{{ diffResult.summary.removed }}</span>
            <span class="ed-stat-label">Removed</span>
          </div>
          <div class="ed-stat ed-changed">
            <span class="ed-stat-value">{{ diffResult.summary.changed }}</span>
            <span class="ed-stat-label">Changed</span>
          </div>
          <div class="ed-stat">
            <span class="ed-stat-value">{{ diffResult.summary.unchanged }}</span>
            <span class="ed-stat-label">Unchanged</span>
          </div>
        </div>
      </div>

      <div v-if="diffResult.summary.warnings.length > 0" class="ed-warnings">
        <div v-for="(warning, i) in diffResult.summary.warnings" :key="i" class="ed-warning">
          ⚠️ {{ warning }}
        </div>
      </div>

      <div class="ed-flags">
        <div
          v-for="flag in diffResult.flags"
          :key="flag.key"
          class="ed-flag"
          :class="`ed-${flag.diffType}`"
        >
          <div class="ed-flag-header">
            <span
              class="ed-flag-badge"
              :style="{ background: getDiffTypeColor(flag.diffType) }"
            >
              {{ getDiffTypeIcon(flag.diffType) }}
            </span>
            <span class="ed-flag-key">{{ flag.key }}</span>
            <span class="ed-flag-type">{{ flag.diffType }}</span>
          </div>

          <div v-if="flag.changes.length > 0" class="ed-changes">
            <div v-for="(change, i) in flag.changes" :key="i" class="ed-change">
              <span class="ed-change-field">{{ change.field }}</span>
              <span class="ed-change-old">{{ change.sourceValue }}</span>
              <span class="ed-change-arrow">→</span>
              <span class="ed-change-new">{{ change.targetValue }}</span>
            </div>
          </div>

          <div v-else class="ed-values">
            <div class="ed-source">
              <span class="ed-label">{{ diffResult.sourceEnv }}</span>
              <span class="ed-value">{{ flag.source?.enabled ? 'ON' : flag.source ? 'OFF' : '—' }}</span>
            </div>
            <div class="ed-target">
              <span class="ed-label">{{ diffResult.targetEnv }}</span>
              <span class="ed-value">{{ flag.target?.enabled ? 'ON' : flag.target ? 'OFF' : '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ed-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.ed-header {
  margin-bottom: 1rem;
}

.ed-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.ed-selector {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ed-env-select {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ed-env-select label {
  font-size: 0.75rem;
  color: #6b7280;
}

.ed-env-select select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-width: 120px;
}

.ed-arrow {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.ed-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.ed-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ed-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ed-result {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ed-summary {
  display: flex;
  gap: 1rem;
}

.ed-risk {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid;
  border-radius: 0.5rem;
  min-width: 80px;
}

.ed-risk-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.ed-risk-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.ed-stats {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.ed-stat {
  flex: 1;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
}

.ed-added { background: #d1fae5; }
.ed-removed { background: #fee2e2; }
.ed-changed { background: #fef3c7; }

.ed-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.ed-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.ed-warnings {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.ed-warning {
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 0.25rem;
}

.ed-warning:last-child {
  margin-bottom: 0;
}

.ed-flags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ed-flag {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.ed-flag.ed-added { border-left: 4px solid #10b981; }
.ed-flag.ed-removed { border-left: 4px solid #ef4444; }
.ed-flag.ed-changed { border-left: 4px solid #f59e0b; }

.ed-flag-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ed-flag-badge {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.ed-flag-key {
  font-weight: 500;
  font-size: 0.875rem;
}

.ed-flag-type {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
  margin-left: auto;
}

.ed-changes {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ed-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.ed-change-field {
  color: #6b7280;
  min-width: 100px;
}

.ed-change-old {
  color: #ef4444;
}

.ed-change-arrow {
  color: #9ca3af;
}

.ed-change-new {
  color: #10b981;
  font-weight: 500;
}

.ed-values {
  display: flex;
  gap: 1rem;
}

.ed-source,
.ed-target {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ed-label {
  font-size: 0.625rem;
  color: #9ca3af;
  text-transform: uppercase;
}

.ed-value {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
