<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-8">
      <slot name="main" />
    </div>

    <!-- Sidebar -->
    <div class="space-y-8">
      <slot name="sidebar" />
    </div>
  </div>
</template>
