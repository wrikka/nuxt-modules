<template>
  <div class="github-upload p-6 space-y-6">
    <!-- Header -->
    <div class="text-center">
      <Icon name="mdi:github" class="mx-auto h-12 w-12 text-gray-800 mb-4" />
      <h3 class="text-xl font-semibold text-gray-900">GitHub Integration</h3>
      <p class="text-gray-600 mt-1">เลือกไฟล์จาก repository ของคุณ</p>
    </div>

    <!-- Connected Account -->
    <div class="bg-gray-50 p-4 rounded-lg border">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <Icon name="mdi:github" class="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <p class="font-medium text-gray-900">john-doe</p>
          <p class="text-sm text-gray-600">เชื่อมต่อแล้ว</p>
        </div>
        <button class="ml-auto text-sm text-red-600 hover:text-red-800">
          ยกเลิกการเชื่อมต่อ
        </button>
      </div>
    </div>

    <!-- Repository Selection -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Repository</label>
        <input
          type="text"
          placeholder="owner/repository"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value="microsoft/vscode"
        />
      </div>

      <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Load Files
      </button>
    </div>

    <!-- File List -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-900">Available Files</h4>
      <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        <div class="space-y-1 p-2">
          <label class="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded">
            <input type="checkbox" class="mr-2">
            <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            README.md
            <span class="ml-auto text-xs text-gray-500">3.2 KB</span>
          </label>
          <div>
            <label class="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded">
              <input type="checkbox" class="mr-2">
              <svg class="w-4 h-4 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
              </svg>
              src/
            </label>
            <div class="ml-4">
              <label class="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded">
                <input type="checkbox" class="mr-2">
                <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                </svg>
                main.ts
                <span class="ml-auto text-xs text-gray-500">15.8 KB</span>
              </label>
            </div>
          </div>
          <label class="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded">
            <input type="checkbox" class="mr-2">
            <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
            </svg>
            package.json
            <span class="ml-auto text-xs text-gray-500">1.2 KB</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Selected Files Count -->
    <div class="text-sm text-gray-600">
      Selected files: 0
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder for GitHub upload functionality
</script>
