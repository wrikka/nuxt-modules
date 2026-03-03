<script setup lang="ts">
import { ref, computed, onMounted } from '#imports';
import type { QuickToggleConfig, QuickToggleFlag } from '#feature-flags/types';
import { DEFAULT_QUICK_TOGGLE_CONFIG } from '#feature-flags/types/quick-toggle';

const props = defineProps<{
  flags: Record<string, boolean>;
}>();

const emit = defineEmits<{
  toggle: [key: string, enabled: boolean];
}>();

const config = ref<QuickToggleConfig>({ ...DEFAULT_QUICK_TOGGLE_CONFIG });
const isOpen = ref(false);
const searchQuery = ref('');
const filter = ref<'all' | 'enabled' | 'disabled'>('all');
const recentFlags = ref<string[]>([]);

const flagList = computed<QuickToggleFlag[]>(() => {
  let flags = Object.entries(props.flags).map(([key, enabled]) => ({
    key,
    enabled,
    toggleCount: 0,
  }));

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    flags = flags.filter((f) => f.key.toLowerCase().includes(query));
  }

  if (filter.value === 'enabled') {
    flags = flags.filter((f) => f.enabled);
  } else if (filter.value === 'disabled') {
    flags = flags.filter((f) => !f.enabled);
  }

  return flags;
});

const pinnedFlags = computed(() => {
  return flagList.value.filter((f) => config.value.pinnedFlags.includes(f.key));
});

const recentFlagsList = computed(() => {
  return flagList.value.filter((f) => recentFlags.value.includes(f.key)).slice(0, config.value.maxRecent);
});

const toggleFlag = (key: string) => {
  const newEnabled = !props.flags[key];
  emit('toggle', key, newEnabled);

  if (!recentFlags.value.includes(key)) {
    recentFlags.value.unshift(key);
    recentFlags.value = recentFlags.value.slice(0, config.value.maxRecent);
  }
};

const togglePin = (key: string) => {
  const index = config.value.pinnedFlags.indexOf(key);
  if (index === -1) {
    config.value.pinnedFlags.push(key);
  } else {
    config.value.pinnedFlags.splice(index, 1);
  }
};

const openWidget = () => {
  isOpen.value = true;
};

const closeWidget = () => {
  isOpen.value = false;
};

const stats = computed(() => ({
  total: Object.keys(props.flags).length,
  enabled: Object.values(props.flags).filter(Boolean).length,
}));
</script>

<template>
  <div
    class="qt-widget"
    :class="[`qt-${config.position}`, { 'qt-open': isOpen }]"
  >
    <button
      v-if="!isOpen"
      class="qt-trigger"
      @click="openWidget"
    >
      <span class="qt-icon">🚩</span>
      <span class="qt-count">{{ stats.enabled }}/{{ stats.total }}</span>
    </button>

    <div v-else class="qt-panel">
      <div class="qt-header">
        <span class="qt-title">Feature Flags</span>
        <button class="qt-close" @click="closeWidget">×</button>
      </div>

      <div class="qt-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search flags..."
          class="qt-input"
        />
      </div>

      <div class="qt-filters">
        <button
          class="qt-filter"
          :class="{ 'qt-active': filter === 'all' }"
          @click="filter = 'all'"
        >
          All
        </button>
        <button
          class="qt-filter"
          :class="{ 'qt-active': filter === 'enabled' }"
          @click="filter = 'enabled'"
        >
          On
        </button>
        <button
          class="qt-filter"
          :class="{ 'qt-active': filter === 'disabled' }"
          @click="filter = 'disabled'"
        >
          Off
        </button>
      </div>

      <div v-if="pinnedFlags.length > 0" class="qt-section">
        <span class="qt-section-title">Pinned</span>
        <div
          v-for="flag in pinnedFlags"
          :key="flag.key"
          class="qt-flag"
          :class="{ 'qt-enabled': flag.enabled }"
        >
          <span class="qt-flag-key">{{ flag.key }}</span>
          <div class="qt-flag-actions">
            <button
              class="qt-toggle"
              :class="{ 'qt-on': flag.enabled }"
              @click="toggleFlag(flag.key)"
            >
              {{ flag.enabled ? 'ON' : 'OFF' }}
            </button>
            <button class="qt-pin qt-pinned" @click="togglePin(flag.key)">📌</button>
          </div>
        </div>
      </div>

      <div v-if="recentFlagsList.length > 0 && searchQuery === ''" class="qt-section">
        <span class="qt-section-title">Recent</span>
        <div
          v-for="flag in recentFlagsList"
          :key="flag.key"
          class="qt-flag"
          :class="{ 'qt-enabled': flag.enabled }"
        >
          <span class="qt-flag-key">{{ flag.key }}</span>
          <div class="qt-flag-actions">
            <button
              class="qt-toggle"
              :class="{ 'qt-on': flag.enabled }"
              @click="toggleFlag(flag.key)"
            >
              {{ flag.enabled ? 'ON' : 'OFF' }}
            </button>
            <button class="qt-pin" @click="togglePin(flag.key)">📌</button>
          </div>
        </div>
      </div>

      <div class="qt-section qt-all">
        <span class="qt-section-title">All Flags</span>
        <div
          v-for="flag in flagList"
          :key="flag.key"
          class="qt-flag"
          :class="{ 'qt-enabled': flag.enabled }"
        >
          <span class="qt-flag-key">{{ flag.key }}</span>
          <div class="qt-flag-actions">
            <button
              class="qt-toggle"
              :class="{ 'qt-on': flag.enabled }"
              @click="toggleFlag(flag.key)"
            >
              {{ flag.enabled ? 'ON' : 'OFF' }}
            </button>
            <button
              class="qt-pin"
              :class="{ 'qt-pinned': config.pinnedFlags.includes(flag.key) }"
              @click="togglePin(flag.key)"
            >
              📌
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qt-widget {
  position: fixed;
  z-index: 9999;
  font-family: system-ui, -apple-system, sans-serif;
}

.qt-bottom-right { bottom: 1rem; right: 1rem; }
.qt-bottom-left { bottom: 1rem; left: 1rem; }
.qt-top-right { top: 1rem; right: 1rem; }
.qt-top-left { top: 1rem; left: 1rem; }

.qt-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.qt-icon {
  font-size: 1rem;
}

.qt-count {
  font-size: 0.75rem;
  font-weight: 500;
}

.qt-panel {
  width: 280px;
  max-height: 400px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.qt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #1f2937;
  color: white;
}

.qt-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.qt-close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  line-height: 1;
}

.qt-search {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.qt-input {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.qt-filters {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.qt-filter {
  flex: 1;
  padding: 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
}

.qt-filter.qt-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.qt-section {
  padding: 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.qt-section-title {
  display: block;
  font-size: 0.625rem;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
}

.qt-all {
  flex: 1;
  overflow-y: auto;
  border-bottom: none;
}

.qt-flag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem;
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
}

.qt-flag:hover {
  background: #f9fafb;
}

.qt-flag.qt-enabled {
  background: #f0fdf4;
}

.qt-flag-key {
  font-size: 0.75rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qt-flag-actions {
  display: flex;
  gap: 0.25rem;
}

.qt-toggle {
  padding: 0.125rem 0.375rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background: white;
  cursor: pointer;
  font-size: 0.625rem;
  font-weight: 500;
}

.qt-toggle.qt-on {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.qt-pin {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.3;
}

.qt-pin:hover,
.qt-pin.qt-pinned {
  opacity: 1;
}
</style>
