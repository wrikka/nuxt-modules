<template>
  <div class="onedrive-upload p-6 space-y-6">
    <!-- Header -->
    <div class="text-center">
      <svg class="mx-auto h-12 w-12 text-blue-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-900">OneDrive Integration</h3>
      <p class="text-gray-600 mt-1">Select files from your OneDrive</p>
    </div>

    <!-- Connected Account -->
    <div class="bg-gray-50 p-4 rounded-lg border">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-900">john.doe@outlook.com</p>
          <p class="text-sm text-gray-600">Connected</p>
        </div>
        <button class="ml-auto text-sm text-red-600 hover:text-red-800">
          ยกเลิกการเชื่อมต่อ
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
          <option>Important Documents</option>
        </select>
      </div>

      <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Load Files
      </button>
    </div>

    <!-- File List -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-900">Available Files</h4>
      <div class="max-h-60 overflow-y-auto">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mb-2">
            <div class="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p class="text-sm font-medium truncate">Monthly Report.pdf</p>
            <p class="text-xs text-gray-500">2.4 MB</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mb-2">
            <div class="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <img src="https://via.placeholder.com/100x80/cccccc/666666?text=IMG" class="w-full h-full object-cover rounded" />
            </div>
            <p class="text-sm font-medium truncate">Family Photo.jpg</p>
            <p class="text-xs text-gray-500">3.8 MB</p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" class="mb-2">
            <div class="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <p class="text-sm font-medium truncate">Sales Data.xlsx</p>
            <p class="text-xs text-gray-500">1.5 MB</p>
          </div>
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
// Placeholder for OneDrive upload functionality
</script>
