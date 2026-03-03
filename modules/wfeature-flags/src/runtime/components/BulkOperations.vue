<script setup lang="ts">
import { ref, computed } from '#imports';
import type { BulkOperation, ExportConfig, ImportConfig, ImportResult } from '#feature-flags/types';

const props = defineProps<{
  flags: Record<string, boolean>;
}>();

const emit = defineEmits<{
  bulkEnable: [keys: string[]];
  bulkDisable: [keys: string[]];
  import: [config: ImportConfig, data: string];
  export: [config: ExportConfig];
}>();

const activeTab = ref<'operations' | 'import' | 'export'>('operations');
const selectedFlags = ref<string[]>([]);
const importData = ref('');
const importConfig = ref<ImportConfig>({
  mode: 'upsert',
  skipInvalid: true,
  validateOnly: false,
});
const exportConfig = ref<ExportConfig>({
  format: 'json',
  includeDisabled: true,
  includeTargeting: true,
  includeVariants: true,
  includeMetadata: false,
});
const operationInProgress = ref<BulkOperation | null>(null);

const flagKeys = computed(() => Object.keys(props.flags));
const selectedCount = computed(() => selectedFlags.value.length);

const selectAll = () => {
  selectedFlags.value = [...flagKeys.value];
};

const deselectAll = () => {
  selectedFlags.value = [];
};

const toggleFlag = (key: string) => {
  const index = selectedFlags.value.indexOf(key);
  if (index === -1) {
    selectedFlags.value.push(key);
  } else {
    selectedFlags.value.splice(index, 1);
  }
};

const bulkEnable = () => {
  if (selectedFlags.value.length > 0) {
    emit('bulkEnable', [...selectedFlags.value]);
    selectedFlags.value = [];
  }
};

const bulkDisable = () => {
  if (selectedFlags.value.length > 0) {
    emit('bulkDisable', [...selectedFlags.value]);
    selectedFlags.value = [];
  }
};

const handleImport = () => {
  if (importData.value.trim()) {
    emit('import', importConfig.value, importData.value);
  }
};

const handleExport = () => {
  emit('export', exportConfig.value);
};

const triggerFileUpload = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.yaml,.csv';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        importData.value = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  };
  input.click();
};
</script>

<template>
  <div class="bop-container">
    <div class="bop-tabs">
      <button
        class="bop-tab"
        :class="{ 'bop-active': activeTab === 'operations' }"
        @click="activeTab = 'operations'"
      >
        Operations
      </button>
      <button
        class="bop-tab"
        :class="{ 'bop-active': activeTab === 'import' }"
        @click="activeTab = 'import'"
      >
        Import
      </button>
      <button
        class="bop-tab"
        :class="{ 'bop-active': activeTab === 'export' }"
        @click="activeTab = 'export'"
      >
        Export
      </button>
    </div>

    <div v-if="activeTab === 'operations'" class="bop-content">
      <div class="bop-selection">
        <div class="bop-selection-header">
          <span>{{ selectedCount }} selected</span>
          <div class="bop-selection-actions">
            <button class="bop-btn bop-btn-sm" @click="selectAll">Select All</button>
            <button class="bop-btn bop-btn-sm" @click="deselectAll">Deselect All</button>
          </div>
        </div>

        <div class="bop-flag-list">
          <label
            v-for="key in flagKeys"
            :key="key"
            class="bop-flag-item"
          >
            <input
              type="checkbox"
              :checked="selectedFlags.includes(key)"
              @change="toggleFlag(key)"
            />
            <span class="bop-flag-key">{{ key }}</span>
            <span
              class="bop-flag-status"
              :class="flags[key] ? 'bop-enabled' : 'bop-disabled'"
            >
              {{ flags[key] ? 'ON' : 'OFF' }}
            </span>
          </label>
        </div>
      </div>

      <div class="bop-actions">
        <button
          class="bop-btn bop-btn-success"
          :disabled="selectedCount === 0"
          @click="bulkEnable"
        >
          Enable Selected
        </button>
        <button
          class="bop-btn bop-btn-danger"
          :disabled="selectedCount === 0"
          @click="bulkDisable"
        >
          Disable Selected
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'import'" class="bop-content">
      <div class="bop-import-config">
        <label class="bop-field">
          <span>Mode:</span>
          <select v-model="importConfig.mode">
            <option value="create">Create only</option>
            <option value="update">Update only</option>
            <option value="upsert">Create or update</option>
          </select>
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="importConfig.skipInvalid" />
          Skip invalid entries
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="importConfig.validateOnly" />
          Validate only (don't apply)
        </label>
      </div>

      <div class="bop-import-data">
        <div class="bop-import-header">
          <span>Paste data or upload file</span>
          <button class="bop-btn bop-btn-sm" @click="triggerFileUpload">
            Upload File
          </button>
        </div>
        <textarea
          v-model="importData"
          placeholder='[{"key": "new-feature", "enabled": true}]'
          rows="8"
        />
      </div>

      <div class="bop-actions">
        <button
          class="bop-btn bop-btn-primary"
          :disabled="!importData.trim()"
          @click="handleImport"
        >
          Import Flags
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'export'" class="bop-content">
      <div class="bop-export-config">
        <label class="bop-field">
          <span>Format:</span>
          <select v-model="exportConfig.format">
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="csv">CSV</option>
          </select>
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="exportConfig.includeDisabled" />
          Include disabled flags
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="exportConfig.includeTargeting" />
          Include targeting rules
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="exportConfig.includeVariants" />
          Include variants
        </label>
        <label class="bop-checkbox">
          <input type="checkbox" v-model="exportConfig.includeMetadata" />
          Include metadata
        </label>
      </div>

      <div class="bop-actions">
        <button class="bop-btn bop-btn-primary" @click="handleExport">
          Export Flags
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bop-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.bop-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.bop-tab {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: #6b7280;
}

.bop-tab.bop-active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  margin-bottom: -0.5rem;
}

.bop-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bop-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.bop-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.bop-btn-primary { background: #3b82f6; color: white; border-color: #3b82f6; }
.bop-btn-success { background: #10b981; color: white; border-color: #10b981; }
.bop-btn-danger { background: #ef4444; color: white; border-color: #ef4444; }

.bop-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bop-selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.bop-selection-actions {
  display: flex;
  gap: 0.5rem;
}

.bop-flag-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

.bop-flag-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  cursor: pointer;
}

.bop-flag-key {
  flex: 1;
  font-size: 0.875rem;
}

.bop-flag-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.bop-enabled { background: #d1fae5; color: #059669; }
.bop-disabled { background: #fee2e2; color: #dc2626; }

.bop-actions {
  display: flex;
  gap: 0.5rem;
}

.bop-import-config,
.bop-export-config {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.bop-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.bop-field select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.bop-checkbox {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.bop-import-data {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bop-import-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.bop-import-data textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: monospace;
  font-size: 0.75rem;
  resize: vertical;
}
</style>
