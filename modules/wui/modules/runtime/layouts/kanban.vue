<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b p-4 bg-background">
      <div class="flex items-center justify-between">
        <slot name="header">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold">Kanban Board</h1>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Add Task
              </button>
              <button class="px-3 py-1 text-sm border rounded hover:bg-muted">
                Filter
              </button>
            </div>
          </div>
        </slot>
        <slot name="header-actions">
          <div class="flex items-center space-x-2">
            <button class="p-2 hover:bg-muted rounded">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </slot>
      </div>
    </header>
    
    <main class="flex-1 overflow-x-auto p-4">
      <div class="flex gap-4 h-full min-w-max">
        <slot name="columns">
          <!-- Default columns -->
          <div class="w-80 flex-shrink-0">
            <div class="bg-muted/50 rounded-lg p-3">
              <h3 class="font-medium mb-3">To Do</h3>
              <div class="space-y-2">
                <NuxtPage />
              </div>
            </div>
          </div>
          
          <div class="w-80 flex-shrink-0">
            <div class="bg-muted/50 rounded-lg p-3">
              <h3 class="font-medium mb-3">In Progress</h3>
              <div class="space-y-2">
                <!-- Tasks will go here -->
              </div>
            </div>
          </div>
          
          <div class="w-80 flex-shrink-0">
            <div class="bg-muted/50 rounded-lg p-3">
              <h3 class="font-medium mb-3">Done</h3>
              <div class="space-y-2">
                <!-- Tasks will go here -->
              </div>
            </div>
          </div>
        </slot>
      </div>
    </main>
  </div>
</template>
