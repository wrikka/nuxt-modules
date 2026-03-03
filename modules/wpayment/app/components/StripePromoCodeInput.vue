<script setup lang="ts">
import { usePromoCode } from '#wpayment/composables/usePromoCode';

interface Props {
  modelValue?: string;
  placeholder?: string;
  customerId?: string;
  showDiscount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter promo code',
  showDiscount: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  valid: [code: string, discount: any];
  invalid: [error: string];
}>();

const { loading, validate } = usePromoCode();

const inputCode = ref(props.modelValue || '');
const validationResult = ref<any>(null);
const isValidating = ref(false);

const handleValidate = async () => {
  if (!inputCode.value.trim()) {
    validationResult.value = null;
    return;
  }

  isValidating.value = true;
  try {
    const result = await validate(inputCode.value.trim(), props.customerId);
    validationResult.value = result;

    if (result.valid) {
      emit('valid', inputCode.value, result.discount);
      emit('update:modelValue', inputCode.value);
    } else {
      emit('invalid', result.error || 'Invalid promo code');
    }
  } finally {
    isValidating.value = false;
  }
};

const clearCode = () => {
  inputCode.value = '';
  validationResult.value = null;
  emit('update:modelValue', '');
};
</script>

<template>
  <div class="stripe-promo-code-input">
    <div class="relative">
      <input
        v-model="inputCode"
        type="text"
        :placeholder="placeholder"
        :class="[
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
          validationResult?.valid ? 'border-green-500 focus:ring-green-500' : '',
          validationResult && !validationResult.valid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary',
        ]"
        @blur="handleValidate"
        @keyup.enter="handleValidate"
      />

      <div v-if="isValidating" class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <button
        v-else-if="validationResult?.valid"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
        @click="clearCode"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>

    <div v-if="validationResult && !validationResult.valid" class="mt-2 text-sm text-red-500">
      {{ validationResult.error }}
    </div>

    <div v-if="validationResult?.valid && showDiscount" class="mt-2 text-sm text-green-600">
      <span v-if="validationResult.discount.type === 'percent'">
        {{ validationResult.discount.value }}% discount applied!
      </span>
      <span v-else>
        {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: validationResult.discount.currency }).format(validationResult.discount.value / 100) }} discount applied!
      </span>
    </div>
  </div>
</template>
