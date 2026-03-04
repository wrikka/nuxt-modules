<script setup lang="ts">
import { ref, computed } from 'vue'

interface NavItem {
  label: string
  href?: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

interface Props {
  logo?: string
  title?: string
  navigation?: NavItem[]
  user?: {
    name: string
    avatar?: string
    email?: string
  }
  variant?: 'default' | 'transparent' | 'bordered'
  sticky?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  sticky: false
})

const emit = defineEmits<{
  'nav-click': [item: NavItem]
  'user-menu-click': [action: string]
}>()

const isMobileMenuOpen = ref(false)

const _variantClasses = computed(() => {
  const variants = {
    default: 'bg-background border-b',
    transparent: 'bg-transparent',
    bordered: 'bg-background border-b-2'
  }
  return variants[props.variant]
})

const _stickyClasses = computed(() => {
  return props.sticky ? 'sticky top-0 z-50' : ''
})

const _onNavClick = (item: NavItem) => {
  emit('nav-click', item)
  isMobileMenuOpen.value = false
}

const _onUserMenuClick = (action: string) => {
  emit('user-menu-click', action)
}

const _toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header :class="['w-full', _variantClasses, _stickyClasses, props.class]">
    <Container size="xl" class="flex h-16 items-center justify-between">
      <!-- Logo/Title -->
      <div class="flex items-center space-x-4">
        <div v-if="props.logo" class="h-8 w-8">
          <img :src="props.logo" :alt="props.title" class="h-full w-full object-contain" />
        </div>
        <Heading v-else-if="props.title" level="3" size="lg">
          {{ props.title }}
        </Heading>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <template v-for="item in props.navigation" :key="item.label">
          <div v-if="item.children" class="relative group">
            <button class="flex items-center space-x-1 text-sm font-medium hover:text-primary">
              <span>{{ item.label }}</span>
              <div class="i-lucide-chevron-down h-4 w-4" />
            </button>
            
            <div class="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                v-for="child in item.children"
                :key="child.label"
                class="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent"
                @click="_onNavClick(child)"
              >
                {{ child.label }}
              </button>
            </div>
          </div>
          
          <Link
            v-else
            :href="item.href"
            class="text-sm font-medium hover:text-primary"
            @click="_onNavClick(item)"
          >
            {{ item.label }}
          </Link>
        </template>
      </nav>

      <!-- User Section -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button class="relative p-2 text-muted-foreground hover:text-foreground">
          <div class="i-lucide-bell h-5 w-5" />
          <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <!-- User Menu -->
        <div v-if="props.user" class="relative group">
          <button class="flex items-center space-x-2">
            <Avatar :src="props.user.avatar" :fallback="props.user.name" size="sm" />
            <div class="hidden md:block text-left">
              <div class="text-sm font-medium">{{ props.user.name }}</div>
              <div v-if="props.user.email" class="text-xs text-muted-foreground">{{ props.user.email }}</div>
            </div>
            <div class="i-lucide-chevron-down h-4 w-4 text-muted-foreground" />
          </button>
          
          <div class="absolute top-full right-0 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              class="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent"
              @click="_onUserMenuClick('profile')"
            >
              Profile
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent"
              @click="_onUserMenuClick('settings')"
            >
              Settings
            </button>
            <hr class="my-1" />
            <button
              class="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent text-destructive"
              @click="_onUserMenuClick('logout')"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 text-muted-foreground hover:text-foreground"
          @click="_toggleMobileMenu"
        >
          <div class="i-lucide-menu h-5 w-5" />
        </button>
      </div>
    </Container>

    <!-- Mobile Navigation -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t bg-background">
      <nav class="px-4 py-2 space-y-1">
        <template v-for="item in props.navigation" :key="item.label">
          <div v-if="item.children" class="space-y-1">
            <div class="px-3 py-2 text-sm font-medium text-muted-foreground">
              {{ item.label }}
            </div>
            <button
              v-for="child in item.children"
              :key="child.label"
              class="w-full text-left px-6 py-2 text-sm rounded hover:bg-accent"
              @click="_onNavClick(child)"
            >
              {{ child.label }}
            </button>
          </div>
          
          <Link
            v-else
            :href="item.href"
            class="block px-3 py-2 text-sm rounded hover:bg-accent"
            @click="_onNavClick(item)"
          >
            {{ item.label }}
          </Link>
        </template>
      </nav>
    </div>
  </header>
</template>
