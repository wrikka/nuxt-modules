<script setup lang="ts">
import { useCustomerPortal } from '#wpayment/composables/useCustomerPortal';

interface Props {
  customerId: string;
  returnUrl?: string;
  configurationId?: string;
  label?: string;
  theme?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Manage Billing',
  theme: 'primary',
  size: 'md',
});

const emit = defineEmits<{
  success: [];
  error: [error: string];
}>();

const { loading, error, getPortalUrl } = useCustomerPortal();

const handleClick = async () => {
  try {
    const url = await getPortalUrl(props.customerId, props.returnUrl);
    window.location.href = url;
    emit('success');
  } catch (err) {
    emit('error', err instanceof Error ? err.message : 'Failed to open portal');
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const themeClasses = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-primary text-primary hover:bg-primary/10',
};
</script>

<template>
  <button
    :class="[
      'rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      themeClasses[theme],
    ]"
    :disabled="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading...
    </span>
    <span v-else>{{ label }}</span>
  </button>
</template>
