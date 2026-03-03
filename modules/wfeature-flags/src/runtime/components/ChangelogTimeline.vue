<script setup lang="ts">
import { ref, computed } from '#imports';
import type { ChangelogEntry, ChangelogAction, Actor } from '#feature-flags/types';

const props = defineProps<{
  flagKey?: string;
}>();

const entries = ref<ChangelogEntry[]>([]);
const isLoading = ref(false);
const filter = ref<{
  action?: ChangelogAction[];
  startDate?: number;
  endDate?: number;
}>({});

const loadHistory = () => {
  isLoading.value = true;

  setTimeout(() => {
    const actors: Actor[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', type: 'user' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', type: 'user' },
      { id: 'system', name: 'System', type: 'system' },
    ];

    const actions: ChangelogAction[] = ['created', 'enabled', 'disabled', 'updated', 'targeting_changed', 'rollout_changed'];

    entries.value = Array.from({ length: 10 }, (_, i) => ({
      id: `entry-${i}`,
      flagKey: props.flagKey || `flag-${i % 3}`,
      action: actions[i % actions.length],
      timestamp: Date.now() - i * 3600000 * 24,
      actor: actors[i % actors.length],
      changes: [
        { field: 'enabled', oldValue: i % 2 === 0, newValue: i % 2 === 1 },
        { field: 'percentage', oldValue: 25, newValue: 50 },
      ],
      environment: ['development', 'staging', 'production'][i % 3],
      reason: i % 2 === 0 ? 'Feature rollout' : undefined,
    }));

    isLoading.value = false;
  }, 400);
};

const getActionIcon = (action: ChangelogAction) => {
  const icons: Record<ChangelogAction, string> = {
    created: '✨',
    enabled: '✅',
    disabled: '❌',
    updated: '📝',
    deleted: '🗑️',
    targeting_changed: '🎯',
    rollout_changed: '📊',
    variant_added: '➕',
    variant_removed: '➖',
  };
  return icons[action] || '•';
};

const getActionColor = (action: ChangelogAction) => {
  const colors: Record<ChangelogAction, string> = {
    created: '#10b981',
    enabled: '#10b981',
    disabled: '#ef4444',
    updated: '#3b82f6',
    deleted: '#ef4444',
    targeting_changed: '#8b5cf6',
    rollout_changed: '#f59e0b',
    variant_added: '#10b981',
    variant_removed: '#ef4444',
  };
  return colors[action] || '#6b7280';
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatValue = (value: unknown) => {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const filteredEntries = computed(() => {
  let result = entries.value;

  if (props.flagKey) {
    result = result.filter((e) => e.flagKey === props.flagKey);
  }

  if (filter.value.action?.length) {
    result = result.filter((e) => filter.value.action!.includes(e.action));
  }

  return result;
});

const groupedByDate = computed(() => {
  const groups: Record<string, ChangelogEntry[]> = {};

  for (const entry of filteredEntries.value) {
    const dateKey = formatDate(entry.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
  }

  return Object.entries(groups).map(([date, entries]) => ({ date, entries }));
});
</script>

<template>
  <div class="ct-container">
    <div class="ct-header">
      <h3>Changelog Timeline</h3>
      <button
        class="ct-btn ct-btn-sm"
        :disabled="isLoading"
        @click="loadHistory"
      >
        {{ isLoading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="entries.length === 0 && !isLoading" class="ct-empty">
      <button class="ct-btn ct-btn-primary" @click="loadHistory">
        Load History
      </button>
    </div>

    <div v-else class="ct-timeline">
      <div
        v-for="group in groupedByDate"
        :key="group.date"
        class="ct-date-group"
      >
        <div class="ct-date-header">{{ group.date }}</div>

        <div class="ct-entries">
          <div
            v-for="entry in group.entries"
            :key="entry.id"
            class="ct-entry"
          >
            <div class="ct-entry-line">
              <div
                class="ct-entry-dot"
                :style="{ background: getActionColor(entry.action) }"
              >
                {{ getActionIcon(entry.action) }}
              </div>
              <div class="ct-entry-connector" />
            </div>

            <div class="ct-entry-content">
              <div class="ct-entry-header">
                <span class="ct-entry-action">{{ entry.action.replace('_', ' ') }}</span>
                <span class="ct-entry-flag">{{ entry.flagKey }}</span>
                <span class="ct-entry-env">{{ entry.environment }}</span>
              </div>

              <div class="ct-entry-details">
                <div class="ct-entry-actor">
                  <span class="ct-actor-avatar">{{ entry.actor.name[0] }}</span>
                  <span class="ct-actor-name">{{ entry.actor.name }}</span>
                </div>
                <span class="ct-entry-time">{{ formatTime(entry.timestamp) }}</span>
              </div>

              <div v-if="entry.changes.length > 0" class="ct-entry-changes">
                <div
                  v-for="(change, i) in entry.changes"
                  :key="i"
                  class="ct-change"
                >
                  <span class="ct-change-field">{{ change.field }}:</span>
                  <span class="ct-change-old">{{ formatValue(change.oldValue) }}</span>
                  <span class="ct-change-arrow">→</span>
                  <span class="ct-change-new">{{ formatValue(change.newValue) }}</span>
                </div>
              </div>

              <div v-if="entry.reason" class="ct-entry-reason">
                Reason: {{ entry.reason }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.ct-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ct-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.ct-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.ct-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.ct-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ct-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ct-empty {
  text-align: center;
  padding: 2rem;
}

.ct-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ct-date-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.ct-entries {
  display: flex;
  flex-direction: column;
}

.ct-entry {
  display: flex;
  gap: 0.75rem;
  padding-bottom: 1rem;
}

.ct-entry-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
}

.ct-entry-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.ct-entry-connector {
  flex: 1;
  width: 2px;
  background: #e5e7eb;
  margin-top: 0.25rem;
}

.ct-entry:last-child .ct-entry-connector {
  display: none;
}

.ct-entry-content {
  flex: 1;
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.ct-entry-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ct-entry-action {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
}

.ct-entry-flag {
  font-family: monospace;
  font-size: 0.75rem;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ct-entry-env {
  font-size: 0.625rem;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.ct-entry-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ct-entry-actor {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.ct-actor-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
}

.ct-actor-name {
  font-size: 0.75rem;
  color: #374151;
}

.ct-entry-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.ct-entry-changes {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.ct-change {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
}

.ct-change-field {
  color: #6b7280;
}

.ct-change-old {
  color: #ef4444;
  text-decoration: line-through;
}

.ct-change-arrow {
  color: #9ca3af;
}

.ct-change-new {
  color: #10b981;
  font-weight: 500;
}

.ct-entry-reason {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}
</style>
