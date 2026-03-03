/**
 * Nuxt Integration Example
 *
 * This example demonstrates how to integrate @wpackages/diff
 * into a Nuxt.js application using the Nuxt module.
 */

// nuxt.config.ts
// export default defineNuxtConfig({
//   devtools: { enabled: true },
//   modules: ['@wpackages/diff'],

//   // Optional: Configure the diff module
//   diff: {
//     // Module options would go here if any
//   }
// })

// Example 1: Using diff utilities in a Nuxt page
// pages/diff-demo.vue
/*
<template>
  <div class="diff-demo">
    <h1>Nuxt Diff Demo</h1>

    <div class="demo-section">
      <h2>Data Comparison</h2>

      <div class="data-inputs">
        <div class="input-group">
          <label>Original Data:</label>
          <textarea v-model="originalData" rows="10" />
        </div>

        <div class="input-group">
          <label>Modified Data:</label>
          <textarea v-model="modifiedData" rows="10" />
        </div>
      </div>

      <button @click="compareData" :disabled="!isValidJson">
        Compare Data
      </button>

      <div v-if="diffResult" class="results">
        <h3>Comparison Results</h3>

        <DiffSummary :diff="diffResult" />

        <div class="raw-diff">
          <h4>Raw Diff:</h4>
          <pre>{{ JSON.stringify(diffResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables are auto-imported from the module
const { $diff, $patch, $validateDiff } = useNuxtApp()

// Component state
const originalData = ref(`{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  },
  "posts": [
    { "id": 1, "title": "First Post", "published": true },
    { "id": 2, "title": "Second Post", "published": false }
  ]
}`)

const modifiedData = ref(`{
  "user": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "preferences": {
      "theme": "light",
      "notifications": false,
      "language": "en"
    }
  },
  "posts": [
    { "id": 1, "title": "First Post", "published": true },
    { "id": 3, "title": "Third Post", "published": true }
  ]
}`)

const diffResult = ref(null)

// Computed properties
const isValidJson = computed(() => {
  try {
    JSON.parse(originalData.value)
    JSON.parse(modifiedData.value)
    return true
  } catch {
    return false
  }
})

// Methods
const compareData = () => {
  try {
    const original = JSON.parse(originalData.value)
    const modified = JSON.parse(modifiedData.value)

    // Use the diff utility
    diffResult.value = $diff(original, modified)

    // Optional: Validate the data
    const validation = $validateDiff(
      { maxDepth: 10, validateTypes: true },
      original,
      modified
    )

    if (!validation.isValid) {
      console.warn('Validation warnings:', validation.warnings)
    }
  } catch (error) {
    console.error('Error comparing data:', error)
  }
}
</script>
*/

// Example 2: Using diff in a Nuxt composable
// composables/useDataSync.ts
/*
import { diff, patch } from '#imports'

export const useDataSync = () => {
  const originalData = ref(null)
  const currentData = ref(null)

  const setOriginalData = (data: any) => {
    originalData.value = data
    currentData.value = JSON.parse(JSON.stringify(data)) // Deep clone
  }

  const getChanges = computed(() => {
    if (!originalData.value || !currentData.value) return null
    return diff(originalData.value, currentData.value)
  })

  const hasChanges = computed(() => {
    const changes = getChanges.value
    if (!changes) return false

    return Object.keys(changes.added).length > 0 ||
           Object.keys(changes.deleted).length > 0 ||
           Object.keys(changes.updated).length > 0
  })

  const saveChanges = () => {
    if (!hasChanges.value) return

    // Here you would typically send changes to your API
    console.log('Saving changes:', getChanges.value)

    // Update original data to reflect saved state
    originalData.value = JSON.parse(JSON.stringify(currentData.value))
  }

  const revertChanges = () => {
    if (!originalData.value) return
    currentData.value = JSON.parse(JSON.stringify(originalData.value))
  }

  return {
    originalData: readonly(originalData),
    currentData,
    getChanges: readonly(getChanges),
    hasChanges: readonly(hasChanges),
    setOriginalData,
    saveChanges,
    revertChanges
  }
}
*/

// Example 3: Using diff components in Nuxt
// pages/components-demo.vue
/*
<template>
  <div class="components-demo">
    <h1>Diff Components Demo</h1>

    <div class="demo-grid">
      <div class="component-demo">
        <h2>DiffSummary Component</h2>
        <DiffSummary
          :diff="sampleDiff"
          title="Sample Changes"
          :showPercentages="true"
        />
      </div>

      <div class="component-demo">
        <h2>FileDiff Component</h2>
        <FileDiff
          :diff="sampleDiff"
          title="File Comparison"
          :expandable="true"
        />
      </div>
    </div>

    <div class="interactive-demo">
      <h2>Interactive Diff</h2>

      <div class="data-editor">
        <div class="editor-section">
          <h3>Before</h3>
          <textarea v-model="beforeJson" @input="updateDiff" />
        </div>

        <div class="editor-section">
          <h3>After</h3>
          <textarea v-model="afterJson" @input="updateDiff" />
        </div>
      </div>

      <div class="diff-display">
        <DiffSummary :diff="interactiveDiff" />
        <FileDiff :diff="interactiveDiff" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Sample data for demonstration
const sampleDiff = ref({
  added: {
    'user.preferences.language': 'en',
    'posts.2': { id: 3, title: 'Third Post', published: true }
  },
  deleted: {
    'user.name': 'John Doe',
    'user.preferences.notifications': true,
    'posts.1': { id: 2, title: 'Second Post', published: false }
  },
  updated: {
    'user.name': 'Jane Smith',
    'user.email': 'jane@example.com',
    'user.preferences.theme': 'light'
  }
})

// Interactive demo data
const beforeJson = ref(JSON.stringify({
  user: { name: 'Alice', role: 'admin' },
  settings: { theme: 'dark', notifications: true }
}, null, 2))

const afterJson = ref(JSON.stringify({
  user: { name: 'Alice Johnson', role: 'admin' },
  settings: { theme: 'light', notifications: false, language: 'en' }
}, null, 2))

const interactiveDiff = ref({})

// Update diff when JSON changes
const updateDiff = () => {
  try {
    const before = JSON.parse(beforeJson.value)
    const after = JSON.parse(afterJson.value)
    interactiveDiff.value = diff(before, after)
  } catch (error) {
    console.error('Invalid JSON:', error)
  }
}

// Initialize diff
updateDiff()
</script>
*/

// Example 4: Server-side diff processing in Nuxt API routes
// server/api/diff.post.ts
/*
import { diff, validateDiff } from '@/utils/diff'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate request
  if (!body.original || !body.modified) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing original or modified data'
    })
  }

  try {
    // Validate data before diffing
    const validation = validateDiff(
      {
        maxDepth: 10,
        validateTypes: true,
        maxArrayLength: 1000,
        allowCircularReferences: false
      },
      body.original,
      body.modified
    )

    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid data for diff operation',
        data: {
          errors: validation.errors,
          warnings: validation.warnings
        }
      })
    }

    // Perform diff
    const diffResult = diff(body.original, body.modified, body.options || {})

    // Calculate statistics
    const stats = {
      added: Object.keys(diffResult.added).length,
      deleted: Object.keys(diffResult.deleted).length,
      updated: Object.keys(diffResult.updated).length,
      total: Object.keys(diffResult.added).length +
             Object.keys(diffResult.deleted).length +
             Object.keys(diffResult.updated).length
    }

    return {
      success: true,
      diff: diffResult,
      stats,
      validation: {
        isValid: validation.isValid,
        warnings: validation.warnings
      }
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Diff operation failed',
      data: { error: error.message }
    })
  }
})
*/

// Example 5: Using diff in Nuxt middleware
// middleware/diff-tracker.ts
/*
import { diff } from '@/utils/diff'

export default defineNuxtRouteMiddleware((to, from) => {
  // Track route data changes
  if (process.client) {
    const routeDiff = diff(
      {
        path: from.path,
        query: from.query,
        params: from.params
      },
      {
        path: to.path,
        query: to.query,
        params: to.params
      }
    )

    // Log significant route changes
    const hasChanges = Object.keys(routeDiff.added).length > 0 ||
                      Object.keys(routeDiff.deleted).length > 0 ||
                      Object.keys(routeDiff.updated).length > 0

    if (hasChanges) {
      console.log('Route changed:', routeDiff)

      // Could send to analytics service
      // analytics.track('route_change', routeDiff)
    }
  }
})
*/

// Example 6: Plugin setup for global diff utilities
// plugins/diff.client.ts
/*
export default defineNuxtPlugin(() => {
  // Make diff utilities globally available
  return {
    provide: {
      diffUtils: {
        diff: (a, b, options) => diff(a, b, options),
        patch: (data, diffResult) => patch(data, diffResult),
        validateDiff: (options, a, b) => validateDiff(options, a, b),
        // Add more utilities as needed
      }
    }
  }
})
*/

console.log("Nuxt integration examples loaded successfully!");
console.log(
	"These examples show how to use @wpackages/diff in various Nuxt contexts.",
);
console.log("Available features:");
console.log("- Auto-imported composables and utilities");
console.log("- Vue components for diff visualization");
console.log("- Server-side API integration");
console.log("- Middleware and plugin support");
