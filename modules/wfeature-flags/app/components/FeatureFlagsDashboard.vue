<script setup lang="ts">
import { ref, computed, onMounted } from '#imports';
import type { FeatureFlag, FlagEvaluationContext } from '#feature-flags/types';

const { flags, isEnabled, setFlag, refreshFlags, setContext, context } = useFeatureFlags();
const { isConnected, connect, disconnect } = useFlagStream();

const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedFlag = ref<FeatureFlag | null>(null);
const searchQuery = ref('');
const filterEnabled = ref<'all' | 'enabled' | 'disabled'>('all');

const flagList = computed(() => {
  const allFlags = Object.entries(flags.value).map(([key, enabled]) => ({
    key,
    enabled,
    name: key,
  }));

  let filtered = allFlags;

  if (searchQuery.value) {
    filtered = filtered.filter((f) =>
      f.key.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  if (filterEnabled.value === 'enabled') {
    filtered = filtered.filter((f) => f.enabled);
  } else if (filterEnabled.value === 'disabled') {
    filtered = filtered.filter((f) => !f.enabled);
  }

  return filtered;
});

const stats = computed(() => ({
  total: Object.keys(flags.value).length,
  enabled: Object.values(flags.value).filter(Boolean).length,
  disabled: Object.values(flags.value).filter((v) => !v).length,
}));

const createFlag = async (key: string, enabled: boolean) => {
  setFlag(key, enabled);
  showCreateModal.value = false;
};

const toggleFlag = (key: string) => {
  setFlag(key, !flags.value[key]);
};

const editFlag = (flag: FeatureFlag) => {
  selectedFlag.value = flag;
  showEditModal.value = true;
};

onMounted(() => {
  refreshFlags();
});
</script>

<template>
  <div class="ff-dashboard">
    <!-- Header -->
    <div class="ff-dashboard-header">
      <div class="ff-dashboard-title">
        <h2>Feature Flags</h2>
        <span class="ff-badge" :class="{ 'ff-connected': isConnected, 'ff-disconnected': !isConnected }">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>
      <button class="ff-btn ff-btn-primary" @click="showCreateModal = true">
        + New Flag
      </button>
    </div>

    <!-- Stats -->
    <div class="ff-stats">
      <div class="ff-stat">
        <span class="ff-stat-value">{{ stats.total }}</span>
        <span class="ff-stat-label">Total</span>
      </div>
      <div class="ff-stat ff-stat-success">
        <span class="ff-stat-value">{{ stats.enabled }}</span>
        <span class="ff-stat-label">Enabled</span>
      </div>
      <div class="ff-stat ff-stat-danger">
        <span class="ff-stat-value">{{ stats.disabled }}</span>
        <span class="ff-stat-label">Disabled</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="ff-filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search flags..."
        class="ff-input"
      />
      <div class="ff-filter-buttons">
        <button
          class="ff-btn"
          :class="{ 'ff-btn-active': filterEnabled === 'all' }"
          @click="filterEnabled = 'all'"
        >
          All
        </button>
        <button
          class="ff-btn"
          :class="{ 'ff-btn-active': filterEnabled === 'enabled' }"
          @click="filterEnabled = 'enabled'"
        >
          Enabled
        </button>
        <button
          class="ff-btn"
          :class="{ 'ff-btn-active': filterEnabled === 'disabled' }"
          @click="filterEnabled = 'disabled'"
        >
          Disabled
        </button>
      </div>
    </div>

    <!-- Flag List -->
    <div class="ff-flag-list">
      <div
        v-for="flag in flagList"
        :key="flag.key"
        class="ff-flag-item"
        :class="{ 'ff-enabled': flag.enabled }"
      >
        <div class="ff-flag-info">
          <span class="ff-flag-name">{{ flag.key }}</span>
          <span class="ff-flag-status">{{ flag.enabled ? 'Enabled' : 'Disabled' }}</span>
        </div>
        <div class="ff-flag-actions">
          <button
            class="ff-btn ff-btn-sm"
            :class="flag.enabled ? 'ff-btn-danger' : 'ff-btn-success'"
            @click="toggleFlag(flag.key)"
          >
            {{ flag.enabled ? 'Disable' : 'Enable' }}
          </button>
          <button class="ff-btn ff-btn-sm" @click="editFlag(flag)">
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="ff-modal-overlay" @click="showCreateModal = false">
      <div class="ff-modal" @click.stop>
        <h3>Create New Flag</h3>
        <form @submit.prevent="createFlag">
          <input type="text" placeholder="Flag key" class="ff-input" required />
          <div class="ff-checkbox">
            <input type="checkbox" id="enabled" />
            <label for="enabled">Enabled by default</label>
          </div>
          <div class="ff-modal-actions">
            <button type="button" class="ff-btn" @click="showCreateModal = false">Cancel</button>
            <button type="submit" class="ff-btn ff-btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ff-dashboard {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.ff-dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.ff-dashboard-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ff-dashboard-title h2 {
  margin: 0;
  font-size: 1.5rem;
}

.ff-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.ff-connected {
  background: #10b981;
  color: white;
}

.ff-disconnected {
  background: #ef4444;
  color: white;
}

.ff-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ff-stat {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.ff-stat-success {
  background: #d1fae5;
}

.ff-stat-danger {
  background: #fee2e2;
}

.ff-stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
}

.ff-stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.ff-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.ff-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.ff-filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.ff-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.ff-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ff-btn-success {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.ff-btn-danger {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.ff-btn-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ff-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.ff-flag-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ff-flag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #ef4444;
}

.ff-flag-item.ff-enabled {
  border-left-color: #10b981;
}

.ff-flag-name {
  font-weight: 500;
}

.ff-flag-status {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.ff-flag-actions {
  display: flex;
  gap: 0.5rem;
}

.ff-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ff-modal {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  min-width: 300px;
}

.ff-modal h3 {
  margin: 0 0 1rem;
}

.ff-modal form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ff-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ff-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
