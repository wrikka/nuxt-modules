<script setup lang="ts">
import { ref } from "vue";
import { useDiff } from "@wpackages/diff";

const diffResult = ref({ added: {}, deleted: {}, updated: {} });

const expectedText = ref(`{
  "name": "John",
  "age": 30,
  "city": "Bangkok"
}`);

const actualText = ref(`{
  "name": "John",
  "age": 31,
  "city": "Bangkok",
  "country": "Thailand"
}`);

const compareData = () => {
	try {
		const expected = JSON.parse(expectedText.value);
		const actual = JSON.parse(actualText.value);

		// ใช้ useDiff composable จาก module
		const { diffResult: newResult } = useDiff(expected, actual);
		diffResult.value = newResult.value;
	} catch (error) {
		console.error("Invalid JSON:", error);
	}
};
</script>

<template>
    <form @submit.prevent="compareData" class="p-8">
      <h1 class="text-2xl font-bold mb-4">Diff Module Demo</h1>
      
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label for="expected-text" class="block font-semibold mb-2">Expected:</label>
          <textarea 
            id="expected-text"
            v-model="expectedText" 
            class="w-full h-32 p-2 border rounded"
            placeholder="Enter expected JSON..."
          />
        </div>
        <div>
          <label for="actual-text" class="block font-semibold mb-2">Actual:</label>
          <textarea 
            id="actual-text"
            v-model="actualText" 
            class="w-full h-32 p-2 border rounded"
            placeholder="Enter actual JSON..."
          />
        </div>
      </div>

      <div class="mb-4">
        <button 
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Compare
        </button>
      </div>

      <div v-if="diffResult" class="space-y-4">
        <div v-if="Object.keys(diffResult.added).length > 0" class="bg-green-50 p-4 rounded">
          <h3 id="added-heading" class="font-semibold text-green-800 mb-2">Added:</h3>
          <pre class="text-sm" role="region" aria-labelledby="added-heading">{{ JSON.stringify(diffResult.added, null, 2) }}</pre>
        </div>
        
        <div v-if="Object.keys(diffResult.deleted).length > 0" class="bg-red-50 p-4 rounded">
          <h3 id="deleted-heading" class="font-semibold text-red-800 mb-2">Deleted:</h3>
          <pre class="text-sm" role="region" aria-labelledby="deleted-heading">{{ JSON.stringify(diffResult.deleted, null, 2) }}</pre>
        </div>
        
        <div v-if="Object.keys(diffResult.updated).length > 0" class="bg-yellow-50 p-4 rounded">
          <h3 id="updated-heading" class="font-semibold text-yellow-800 mb-2">Updated:</h3>
          <pre class="text-sm" role="region" aria-labelledby="updated-heading">{{ JSON.stringify(diffResult.updated, null, 2) }}</pre>
        </div>
      </div>
    </form>
</template>
