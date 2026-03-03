<script setup lang="ts">
import { ref, computed } from '#imports';
import type { FlagImpact, ImpactSummary, AffectedPage, AffectedComponent } from '#feature-flags/types';

const props = defineProps<{
  flagKey: string;
}>();

const isAnalyzing = ref(false);
const impactResult = ref<FlagImpact | null>(null);
const summary = ref<ImpactSummary | null>(null);

const analyze = () => {
  isAnalyzing.value = true;

  setTimeout(() => {
    impactResult.value = {
      flagKey: props.flagKey,
      affectedPages: [
        { path: '/dashboard', name: 'Dashboard', lineNumbers: [45, 67, 89] },
        { path: '/settings', name: 'Settings', lineNumbers: [23, 156] },
        { path: '/profile', name: 'Profile', lineNumbers: [78] },
      ],
      affectedComponents: [
        { name: 'DashboardWidget', filePath: 'components/DashboardWidget.vue', lineNumbers: [12, 34], usageType: 'conditional' },
        { name: 'SettingsPanel', filePath: 'components/SettingsPanel.vue', lineNumbers: [56], usageType: 'variant' },
        { name: 'UserProfile', filePath: 'components/UserProfile.vue', lineNumbers: [23, 45], usageType: 'experiment' },
      ],
      affectedRoutes: [
        { path: '/api/feature', method: 'GET', handler: 'server/api/feature.get' },
        { path: '/api/settings', method: 'POST', handler: 'server/api/settings.post' },
      ],
      usageCount: 8,
      lastUsed: Date.now() - 3600000,
    };

    summary.value = {
      totalPages: 3,
      totalComponents: 3,
      totalRoutes: 2,
      riskLevel: 'medium',
      recommendations: [
        'Test all affected pages before enabling/disabling',
        'Review component usage for potential edge cases',
        'Consider staged rollout for this flag',
      ],
    };

    isAnalyzing.value = false;
  }, 800);
};

const getRiskColor = (level: string) => {
  const colors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return colors[level] || '#6b7280';
};

const getUsageIcon = (type: string) => {
  const icons: Record<string, string> = {
    conditional: '⟳',
    variant: '⬡',
    experiment: '🔬',
  };
  return icons[type] || '•';
};
</script>

<template>
  <div class="fia-container">
    <div class="fia-header">
      <h3>Impact Analysis</h3>
      <span class="fia-flag-key">{{ flagKey }}</span>
    </div>

    <button
      v-if="!impactResult"
      class="fia-btn fia-btn-primary"
      :disabled="isAnalyzing"
      @click="analyze"
    >
      {{ isAnalyzing ? 'Analyzing...' : 'Analyze Impact' }}
    </button>

    <template v-if="impactResult && summary">
      <div class="fia-summary">
        <div class="fia-risk" :style="{ borderColor: getRiskColor(summary.riskLevel) }">
          <span class="fia-risk-label">Risk Level</span>
          <span class="fia-risk-value" :style="{ color: getRiskColor(summary.riskLevel) }">
            {{ summary.riskLevel.toUpperCase() }}
          </span>
        </div>

        <div class="fia-stats">
          <div class="fia-stat">
            <span class="fia-stat-icon">📄</span>
            <span class="fia-stat-value">{{ summary.totalPages }}</span>
            <span class="fia-stat-label">Pages</span>
          </div>
          <div class="fia-stat">
            <span class="fia-stat-icon">🧩</span>
            <span class="fia-stat-value">{{ summary.totalComponents }}</span>
            <span class="fia-stat-label">Components</span>
          </div>
          <div class="fia-stat">
            <span class="fia-stat-icon">🔌</span>
            <span class="fia-stat-value">{{ summary.totalRoutes }}</span>
            <span class="fia-stat-label">Routes</span>
          </div>
        </div>
      </div>

      <div class="fia-sections">
        <div class="fia-section">
          <h4>Affected Pages</h4>
          <div class="fia-list">
            <div
              v-for="page in impactResult.affectedPages"
              :key="page.path"
              class="fia-item"
            >
              <div class="fia-item-main">
                <span class="fia-item-name">{{ page.name }}</span>
                <span class="fia-item-path">{{ page.path }}</span>
              </div>
              <span class="fia-item-lines">Lines: {{ page.lineNumbers.join(', ') }}</span>
            </div>
          </div>
        </div>

        <div class="fia-section">
          <h4>Affected Components</h4>
          <div class="fia-list">
            <div
              v-for="comp in impactResult.affectedComponents"
              :key="comp.name"
              class="fia-item"
            >
              <div class="fia-item-main">
                <span class="fia-item-icon">{{ getUsageIcon(comp.usageType) }}</span>
                <span class="fia-item-name">{{ comp.name }}</span>
              </div>
              <span class="fia-item-type">{{ comp.usageType }}</span>
            </div>
          </div>
        </div>

        <div class="fia-section">
          <h4>Affected Routes</h4>
          <div class="fia-list">
            <div
              v-for="route in impactResult.affectedRoutes"
              :key="route.path"
              class="fia-item"
            >
              <div class="fia-item-main">
                <span class="fia-item-method" :class="'fia-' + route.method.toLowerCase()">
                  {{ route.method }}
                </span>
                <span class="fia-item-path">{{ route.path }}</span>
              </div>
              <span class="fia-item-handler">{{ route.handler }}</span>
            </div>
          </div>
        </div>

        <div class="fia-recommendations">
          <h4>Recommendations</h4>
          <ul>
            <li v-for="(rec, i) in summary.recommendations" :key="i">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fia-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.fia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.fia-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.fia-flag-key {
  font-family: monospace;
  font-size: 0.875rem;
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.fia-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.fia-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.fia-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fia-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.fia-risk {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid;
  border-radius: 0.5rem;
  min-width: 100px;
}

.fia-risk-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.fia-risk-value {
  font-size: 1rem;
  font-weight: 600;
}

.fia-stats {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.fia-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.fia-stat-icon {
  font-size: 1.25rem;
}

.fia-stat-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.fia-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.fia-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fia-section h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.fia-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.fia-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.fia-item-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fia-item-icon {
  font-size: 1rem;
}

.fia-item-name {
  font-weight: 500;
}

.fia-item-path {
  color: #6b7280;
  font-family: monospace;
  font-size: 0.75rem;
}

.fia-item-lines {
  font-size: 0.75rem;
  color: #6b7280;
}

.fia-item-type {
  font-size: 0.75rem;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: capitalize;
}

.fia-item-method {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.fia-get { background: #d1fae5; color: #059669; }
.fia-post { background: #dbeafe; color: #2563eb; }
.fia-put { background: #fef3c7; color: #d97706; }
.fia-delete { background: #fee2e2; color: #dc2626; }

.fia-item-handler {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.fia-recommendations {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.fia-recommendations h4 {
  margin: 0 0 0.5rem;
  color: #92400e;
}

.fia-recommendations ul {
  margin: 0;
  padding-left: 1.25rem;
}

.fia-recommendations li {
  font-size: 0.875rem;
  color: #78350f;
  margin-bottom: 0.25rem;
}
</style>
