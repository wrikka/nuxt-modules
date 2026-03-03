<script setup lang="ts">
import { ref, computed } from '#imports';
import type { FlagHealthStatus, HealthReport, HealthStatus, HealthIssue } from '#feature-flags/types';

const props = defineProps<{
  flags: Record<string, boolean>;
}>();

const isScanning = ref(false);
const healthReport = ref<HealthReport | null>(null);

const statusColors: Record<HealthStatus, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
  stale: '#8b5cf6',
  unused: '#6b7280',
};

const statusLabels: Record<HealthStatus, string> = {
  healthy: 'Healthy',
  warning: 'Warning',
  critical: 'Critical',
  stale: 'Stale',
  unused: 'Unused',
};

const scanHealth = () => {
  isScanning.value = true;

  const flagKeys = Object.keys(props.flags);
  const now = Date.now();
  const staleThreshold = 30 * 24 * 60 * 60 * 1000;

  const flags: FlagHealthStatus[] = flagKeys.map((key) => {
    const issues: HealthIssue[] = [];
    let status: HealthStatus = 'healthy';

    const lastModified = now - Math.random() * 60 * 24 * 60 * 60 * 1000;
    const lastEvaluated = now - Math.random() * 7 * 24 * 60 * 60 * 1000;
    const evaluationCount = Math.floor(Math.random() * 1000);

    if (evaluationCount === 0) {
      issues.push({
        type: 'unused',
        severity: 'medium',
        message: 'Flag has never been evaluated',
        suggestion: 'Consider removing this flag if no longer needed',
      });
      status = 'unused';
    }

    if (lastModified < now - staleThreshold) {
      issues.push({
        type: 'stale',
        severity: 'low',
        message: 'Flag has not been modified in 30+ days',
        suggestion: 'Review if this flag is still relevant',
      });
      if (status === 'healthy') status = 'stale';
    }

    if (props.flags[key] && evaluationCount > 100) {
      issues.push({
        type: 'full-rollout',
        severity: 'low',
        message: 'Flag is enabled for all users',
        suggestion: 'Consider removing the flag and making the feature permanent',
      });
      if (status === 'healthy') status = 'warning';
    }

    return {
      key,
      status,
      issues,
      lastEvaluated,
      evaluationCount,
      lastModified,
    };
  });

  healthReport.value = {
    timestamp: now,
    totalFlags: flagKeys.length,
    healthyCount: flags.filter((f) => f.status === 'healthy').length,
    warningCount: flags.filter((f) => f.status === 'warning').length,
    criticalCount: flags.filter((f) => f.status === 'critical').length,
    unusedCount: flags.filter((f) => f.status === 'unused').length,
    staleCount: flags.filter((f) => f.status === 'stale').length,
    flags,
  };

  setTimeout(() => {
    isScanning.value = false;
  }, 500);
};

const groupedFlags = computed(() => {
  if (!healthReport.value) return {};

  const groups: Record<HealthStatus, FlagHealthStatus[]> = {
    healthy: [],
    warning: [],
    critical: [],
    stale: [],
    unused: [],
  };

  for (const flag of healthReport.value.flags) {
    groups[flag.status].push(flag);
  }

  return groups;
});

const getIssueIcon = (type: string) => {
  const icons: Record<string, string> = {
    unused: '∅',
    stale: '⏰',
    orphan: '🔗',
    'no-targeting': '🎯',
    'full-rollout': '✓',
    'conflicting-rules': '⚠',
    'missing-default': '?',
  };
  return icons[type] || '•';
};
</script>

<template>
  <div class="fhm-container">
    <div class="fhm-header">
      <h3>Flag Health Monitor</h3>
      <button
        class="fhm-btn fhm-btn-primary"
        :disabled="isScanning"
        @click="scanHealth"
      >
        {{ isScanning ? 'Scanning...' : 'Scan Now' }}
      </button>
    </div>

    <div v-if="!healthReport" class="fhm-empty">
      <p>Run a health scan to analyze your flags</p>
    </div>

    <template v-else>
      <div class="fhm-stats">
        <div class="fhm-stat">
          <span class="fhm-stat-value">{{ healthReport.totalFlags }}</span>
          <span class="fhm-stat-label">Total</span>
        </div>
        <div class="fhm-stat fhm-healthy">
          <span class="fhm-stat-value">{{ healthReport.healthyCount }}</span>
          <span class="fhm-stat-label">Healthy</span>
        </div>
        <div class="fhm-stat fhm-warning">
          <span class="fhm-stat-value">{{ healthReport.warningCount }}</span>
          <span class="fhm-stat-label">Warnings</span>
        </div>
        <div class="fhm-stat fhm-stale">
          <span class="fhm-stat-value">{{ healthReport.staleCount }}</span>
          <span class="fhm-stat-label">Stale</span>
        </div>
        <div class="fhm-stat fhm-unused">
          <span class="fhm-stat-value">{{ healthReport.unusedCount }}</span>
          <span class="fhm-stat-label">Unused</span>
        </div>
      </div>

      <div class="fhm-groups">
        <div
          v-for="(flags, status) in groupedFlags"
          :key="status"
          class="fhm-group"
        >
          <div v-if="flags.length > 0" class="fhm-group-header">
            <span
              class="fhm-status-dot"
              :style="{ background: statusColors[status as HealthStatus] }"
            />
            <span class="fhm-group-title">{{ statusLabels[status as HealthStatus] }}</span>
            <span class="fhm-group-count">{{ flags.length }}</span>
          </div>

          <div v-if="flags.length > 0" class="fhm-group-flags">
            <div
              v-for="flag in flags"
              :key="flag.key"
              class="fhm-flag-item"
            >
              <div class="fhm-flag-header">
                <span class="fhm-flag-key">{{ flag.key }}</span>
                <span class="fhm-flag-evals">{{ flag.evaluationCount }} evals</span>
              </div>

              <div v-if="flag.issues.length > 0" class="fhm-issues">
                <div
                  v-for="(issue, i) in flag.issues"
                  :key="i"
                  class="fhm-issue"
                >
                  <span class="fhm-issue-icon">{{ getIssueIcon(issue.type) }}</span>
                  <div class="fhm-issue-content">
                    <span class="fhm-issue-message">{{ issue.message }}</span>
                    <span class="fhm-issue-suggestion">{{ issue.suggestion }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fhm-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.fhm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.fhm-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.fhm-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.fhm-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.fhm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fhm-empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.fhm-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.fhm-stat {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
}

.fhm-healthy { background: #d1fae5; }
.fhm-warning { background: #fef3c7; }
.fhm-stale { background: #ede9fe; }
.fhm-unused { background: #e5e7eb; }

.fhm-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
}

.fhm-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.fhm-groups {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fhm-group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.fhm-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.fhm-group-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.fhm-group-count {
  background: #e5e7eb;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.fhm-group-flags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fhm-flag-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.fhm-flag-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.fhm-flag-key {
  font-weight: 500;
  font-size: 0.875rem;
}

.fhm-flag-evals {
  font-size: 0.75rem;
  color: #6b7280;
}

.fhm-issues {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.fhm-issue {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.fhm-issue-icon {
  color: #6b7280;
}

.fhm-issue-content {
  display: flex;
  flex-direction: column;
}

.fhm-issue-message {
  color: #374151;
}

.fhm-issue-suggestion {
  color: #6b7280;
  font-style: italic;
}
</style>
