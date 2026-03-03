<template>
  <div class="min-h-screen flex">
    <aside class="w-64 border-r bg-muted/30 flex flex-col">
      <slot name="sidebar-header">
        <div class="p-4 border-b">
          <h2 class="font-semibold">Files</h2>
        </div>
      </slot>
      
      <div class="flex-1 overflow-y-auto p-2">
        <slot name="sidebar-content">
          <div class="space-y-1">
            <div class="p-2 hover:bg-muted rounded cursor-pointer text-sm">
              📄 index.ts
            </div>
            <div class="p-2 hover:bg-muted rounded cursor-pointer text-sm">
              📁 components/
            </div>
            <div class="p-2 hover:bg-muted rounded cursor-pointer text-sm ml-4">
              📄 Button.vue
            </div>
            <div class="p-2 hover:bg-muted rounded cursor-pointer text-sm ml-4">
              📄 Card.vue
            </div>
          </div>
        </slot>
      </div>
      
      <slot name="sidebar-footer">
        <div class="p-4 border-t text-xs text-muted-foreground">
          2 files open
        </div>
      </slot>
    </aside>
    
    <div class="flex-1 flex flex-col">
      <header class="border-b p-2 bg-background flex items-center justify-between">
        <slot name="editor-tabs">
          <div class="flex space-x-1">
            <div class="px-3 py-1 bg-muted border rounded-t text-sm">
              index.ts
            </div>
            <div class="px-3 py-1 hover:bg-muted border rounded-t text-sm">
              Button.vue
            </div>
          </div>
        </slot>
        
        <slot name="editor-actions">
          <div class="flex items-center space-x-2">
            <button class="p-1 hover:bg-muted rounded text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"></path>
              </svg>
            </button>
            <button class="p-1 hover:bg-muted rounded text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </slot>
      </header>
      
      <main class="flex-1 flex">
        <div class="flex-1 bg-background">
          <slot name="editor-main">
            <div class="p-4 font-mono text-sm">
              <NuxtPage />
            </div>
          </slot>
        </div>
        
        <slot name="editor-sidebar">
          <aside class="w-64 border-l bg-muted/30 p-4">
            <h3 class="font-medium mb-4">Explorer</h3>
            <div class="space-y-4 text-sm">
              <div>
                <h4 class="text-muted-foreground mb-2">Outline</h4>
                <div class="space-y-1">
                  <div class="p-1 hover:bg-muted rounded cursor-pointer">function main()</div>
                  <div class="p-1 hover:bg-muted rounded cursor-pointer ml-2">const data = []</div>
                  <div class="p-1 hover:bg-muted rounded cursor-pointer ml-2">return result</div>
                </div>
              </div>
            </div>
          </aside>
        </slot>
      </main>
    </div>
  </div>
</template>
