<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div :class="{ dark: isDark }" class="min-h-screen bg-background text-foreground transition-colors">
    <header class="border-b border-border p-4">
      <div class="mx-auto max-w-6xl flex items-center justify-between">
        <h1 class="text-2xl font-bold">
          WTheme
        </h1>
        <button
          class="rounded-lg border border-border px-4 py-2 hover:bg-surface"
          @click="toggleDark"
        >
          {{ isDark ? 'Light' : 'Dark' }}
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl p-6">
      <!-- Primary Colors -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">
          Primary Colors
        </h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="rounded-lg bg-primary p-4 text-primary-foreground">
            Primary
          </div>
          <div class="rounded-lg bg-primary-hover p-4 text-primary-foreground">
            Primary Hover
          </div>
          <div class="rounded-lg bg-secondary p-4 text-secondary-foreground">
            Secondary
          </div>
          <div class="rounded-lg bg-secondary-hover p-4 text-secondary-foreground">
            Secondary Hover
          </div>
        </div>
      </section>

      <!-- Status Colors -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">
          Status Colors
        </h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div class="rounded-lg bg-success p-4 text-success-foreground">
            Success
          </div>
          <div class="rounded-lg bg-warning p-4 text-warning-foreground">
            Warning
          </div>
          <div class="rounded-lg bg-destructive p-4 text-destructive-foreground">
            Destructive
          </div>
        </div>
      </section>

      <!-- Surface Colors -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">
          Surface Colors
        </h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div class="rounded-lg border border-border bg-surface p-4 text-surface-foreground">
            Surface
          </div>
          <div class="rounded-lg border border-border bg-surface-elevated p-4 text-surface-foreground">
            Surface Elevated
          </div>
          <div class="rounded-lg bg-muted p-4 text-muted-foreground">
            Muted
          </div>
        </div>
      </section>

      <!-- Accent & Border -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">
          Accent & Border
        </h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="rounded-lg bg-accent p-4 text-accent-foreground">
            Accent
          </div>
          <div class="rounded-lg border-2 border-border p-4">
            Border
          </div>
          <div class="rounded-lg border-2 border-focus p-4">
            Focus
          </div>
          <div class="rounded-lg bg-skeleton p-4">
            Skeleton
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section>
        <h2 class="mb-4 text-xl font-semibold">
          Button Examples
        </h2>
        <div class="flex flex-wrap gap-4">
          <button class="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-hover">
            Primary Button
          </button>
          <button class="rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary-hover">
            Secondary Button
          </button>
          <button class="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive-hover">
            Destructive Button
          </button>
          <button class="rounded-lg border border-border bg-surface px-4 py-2 text-surface-foreground hover:border-border-hover">
            Outline Button
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
