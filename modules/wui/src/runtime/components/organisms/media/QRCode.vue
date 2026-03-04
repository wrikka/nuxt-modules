<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

interface Props {
  value: string
  size?: number
  color?: string
  backgroundColor?: string
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  color: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M'
})

const qrcode = useQRCode(() => props.value, {
  errorCorrectionLevel: props.errorCorrectionLevel,
  width: props.size,
  color: {
    dark: props.color,
    light: props.backgroundColor
  }
})
</script>

<template>
  <img
    :src="qrcode"
    :width="size"
    :height="size"
    alt="QR Code"
    class="rounded-lg"
  />
</template>
