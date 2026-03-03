<template>
  <div class="diff-demo">
    <h1>Vue Diff Composables Demo</h1>

    <!-- Data Input Section -->
    <div class="input-section">
      <div class="input-group">
        <h3>Original Data (JSON)</h3>
        <textarea
          v-model="originalJson"
          @input="updateDiff"
          placeholder="Enter JSON object..."
          rows="8"
        />
      </div>

      <div class="input-group">
        <h3>Modified Data (JSON)</h3>
        <textarea
          v-model="modifiedJson"
          @input="updateDiff"
          placeholder="Enter JSON object..."
          rows="8"
        />
      </div>
    </div>

    <!-- Diff Summary -->
    <div class="diff-summary">
      <h3>Changes Summary</h3>
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-label">Added:</span>
          <span class="stat-value added">{{ addedCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Deleted:</span>
          <span class="stat-value deleted">{{ deletedCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Updated:</span>
          <span class="stat-value updated">{{ updatedCount }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Changes:</span>
          <span class="stat-value total">{{ totalChanges }}</span>
        </div>
      </div>

      <div v-if="hasChanges" class="change-indicator">
        ✅ Data has been modified
      </div>
      <div v-else class="change-indicator">
        🔄 No changes detected
      </div>
    </div>

    <!-- Unified Diff Display -->
    <div class="unified-diff">
      <h3>Unified Diff</h3>
      <pre class="diff-output">{{ unifiedDiff }}</pre>
    </div>

    <!-- Raw Diff Result -->
    <div class="raw-diff">
      <h3>Raw Diff Result</h3>
      <details>
        <summary>Click to expand raw diff data</summary>
        <pre>{{ JSON.stringify(diffResult, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiff, useDiffStatus, useUnifiedDiff } from "@wpackages/diff";
import { computed, ref } from "vue";

// Reactive data
const originalJson = ref(`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}`);

const modifiedJson = ref(`{
  "name": "Jane Smith",
  "age": 31,
  "email": "jane@example.com",
  "active": true,
  "preferences": {
    "theme": "light",
    "notifications": false,
    "language": "en"
  },
  "department": "Engineering"
}`);

// Parse JSON safely
const parseJson = (jsonString: string) => {
	try {
		return JSON.parse(jsonString);
	} catch {
		return {};
	}
};

// Computed reactive data
const originalData = computed(() => parseJson(originalJson.value));
const modifiedData = computed(() => parseJson(modifiedJson.value));

// Use diff composables
const { diffResult } = useDiff(originalData, modifiedData);
const { hasChanges, addedCount, deletedCount, updatedCount, totalChanges } =
	useDiffStatus(diffResult);
const { unifiedDiff } = useUnifiedDiff(diffResult, {
	contextLines: 3,
	title: "Data Changes",
});

// Update diff when data changes
const updateDiff = () => {
	// The composables will automatically update due to reactivity
};
</script>

<style scoped>
.diff-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group h3 {
  margin-bottom: 10px;
  color: #333;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #007acc;
}

.diff-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.diff-summary h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: bold;
  font-size: 18px;
}

.stat-value.added { color: #28a745; }
.stat-value.deleted { color: #dc3545; }
.stat-value.updated { color: #ffc107; }
.stat-value.total { color: #007acc; }

.change-indicator {
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  font-weight: 500;
}

.unified-diff, .raw-diff {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.unified-diff h3, .raw-diff h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.diff-output, .raw-diff pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.raw-diff details {
  cursor: pointer;
}

.raw-diff summary {
  font-weight: 500;
  color: #666;
  margin-bottom: 10px;
}

.raw-diff pre {
  background: #2d3748;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Responsive design */
@media (max-width: 768px) {
  .input-section {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
