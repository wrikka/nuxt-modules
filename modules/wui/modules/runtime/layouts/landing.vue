<template>
  <div class="min-h-screen">
    <header class="fixed top-0 w-full z-40 bg-background/80 backdrop-blur border-b">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <slot name="nav-brand">
          <div class="font-bold text-xl">Brand</div>
        </slot>
        <slot name="nav-links">
          <div class="hidden md:flex space-x-6">
            <a href="#" class="hover:text-primary">Features</a>
            <a href="#" class="hover:text-primary">Pricing</a>
            <a href="#" class="hover:text-primary">About</a>
          </div>
        </slot>
        <slot name="nav-actions">
          <div class="flex items-center space-x-4">
            <button class="text-sm hover:text-primary">Sign In</button>
            <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Get Started
            </button>
          </div>
        </slot>
      </nav>
    </header>
    
    <main class="pt-16">
      <NuxtPage />
    </main>
    
    <footer class="border-t bg-muted/50">
      <div class="container mx-auto px-4 py-8">
        <slot name="footer">
          <div class="text-center text-sm text-muted-foreground">
            © 2024 Your Company. All rights reserved.
          </div>
        </slot>
      </div>
    </footer>
  </div>
</template>
