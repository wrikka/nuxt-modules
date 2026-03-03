<template>
  <div class="googledrive-upload p-6 space-y-6">
    <!-- Header -->
    <div class="text-center">
      <svg class="mx-auto h-12 w-12 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4-5h-2V7h2v5zm4 3h-2v-3h2v3z"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-900">Google Drive Integration</h3>
      <p class="text-gray-600 mt-1">Select files from your Google Drive</p>
    </div>

    <!-- Connected Account -->
    <div class="bg-gray-50 p-4 rounded-lg border">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-900">john.doe@gmail.com</p>
          <p class="text-sm text-gray-600">Connected</p>
        </div>
        <button class="ml-auto text-sm text-red-600 hover:text-red-800">
          Disconnect
        </button>
      </div>
    </div>

    <!-- Folder Navigation -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Folder</label>
        <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>My Drive</option>
          <option>Documents</option>
          <option>Images</option>
          <option>Downloads</option>
          <option>Important</option>
        </select>
      </div>

      <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Load Files
      </button>
    </div>

    <!-- File List -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-900">Available Files</h4>
      <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        <div class="divide-y divide-gray-200">
          <label class="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mr-3">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">Monthly Report.pdf</p>
              <p class="text-xs text-gray-500">2.4 MB</p>
            </div>
          </label>
          <label class="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mr-3">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">Family Photo.jpg</p>
              <p class="text-xs text-gray-500">3.8 MB</p>
            </div>
          </label>
          <label class="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mr-3">
            <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">Sales Data.xlsx</p>
              <p class="text-xs text-gray-500">1.5 MB</p>
            </div>
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
// Placeholder for Google Drive upload functionality
</script>
