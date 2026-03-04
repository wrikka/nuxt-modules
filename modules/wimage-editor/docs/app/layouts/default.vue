<template>
  <div class="min-h-screen">
    <header class="border-b bg-white p-4">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-xl font-bold">wimage-editor</h1>
        <nav class="flex gap-4">
          <NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink>
          <NuxtLink to="/guide" class="hover:text-blue-600">Guide</NuxtLink>
          <NuxtLink to="/examples" class="hover:text-blue-600">Examples</NuxtLink>
        </nav>
      </div>
    </header>
    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>
