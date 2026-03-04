<script setup lang="ts">
interface ColorFormat {
  hex: string
  rgb: { r: number; g: number; b: number; a: number }
  hsl: { h: number; s: number; l: number; a: number }
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputColor = ref(props.modelValue || '#3b82f6')
const copied = ref(false)

const formats = computed<ColorFormat>(() => {
  const hex = inputColor.value
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  const hsl = rgbToHsl(r, g, b)
  
  return {
    hex,
    rgb: { r, g, b, a: 1 },
    hsl
  }
})

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a: 1 }
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 1500)
}

const colorVariations = computed(() => {
  const base = formats.value.rgb
  return {
    lighter: { r: Math.min(255, base.r + 40), g: Math.min(255, base.g + 40), b: Math.min(255, base.b + 40) },
    darker: { r: Math.max(0, base.r - 40), g: Math.max(0, base.g - 40), b: Math.max(0, base.b - 40) },
    complementary: { r: 255 - base.r, g: 255 - base.g, b: 255 - base.b }
  }
})
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4">
    <div class="mb-4 flex items-center gap-4">
      <input v-model="inputColor" type="color" class="h-12 w-12 rounded cursor-pointer" />
      <div class="flex-1">
        <label class="text-sm font-medium">Base Color</label>
        <input v-model="inputColor" type="text" class="mt-1 w-full rounded border border-gray-200 px-2 py-1 font-mono text-sm" />
      </div>
    </div>
    
    <div class="space-y-2 font-mono text-sm">
      <div class="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
        <span class="text-gray-500">HEX</span>
        <div class="flex items-center gap-2">
          <span class="font-medium">{{ formats.hex }}</span>
          <button class="text-gray-400 hover:text-gray-600" @click="copyToClipboard(formats.hex)">
            <span :class="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="size-4" />
          </button>
        </div>
      </div>
      
      <div class="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
        <span class="text-gray-500">RGB</span>
        <div class="flex items-center gap-2">
          <span class="font-medium">rgb({{ formats.rgb.r }}, {{ formats.rgb.g }}, {{ formats.rgb.b }})</span>
          <button class="text-gray-400 hover:text-gray-600" @click="copyToClipboard(`rgb(${formats.rgb.r}, ${formats.rgb.g}, ${formats.rgb.b})`)">
            <span class="i-lucide-copy size-4" />
          </button>
        </div>
      </div>
      
      <div class="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
        <span class="text-gray-500">HSL</span>
        <div class="flex items-center gap-2">
          <span class="font-medium">hsl({{ formats.hsl.h }}, {{ formats.hsl.s }}%, {{ formats.hsl.l }}%)</span>
          <button class="text-gray-400 hover:text-gray-600" @click="copyToClipboard(`hsl(${formats.hsl.h}, ${formats.hsl.s}%, ${formats.hsl.l}%)`)">
            <span class="i-lucide-copy size-4" />
          </button>
        </div>
      </div>
      
      <div class="flex items-center justify-between rounded bg-gray-50 px-3 py-2">
        <span class="text-gray-500">Tailwind</span>
        <div class="flex items-center gap-2">
          <span class="font-medium">bg-[{{ formats.hex }}]</span>
          <button class="text-gray-400 hover:text-gray-600" @click="copyToClipboard(`bg-[${formats.hex}]`)">
            <span class="i-lucide-copy size-4" />
          </button>
        </div>
      </div>
    </div>
    
    <div class="mt-4">
      <p class="mb-2 text-sm font-medium">Color Variations</p>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded p-3 text-center text-xs" :style="{ backgroundColor: `rgb(${colorVariations.lighter.r}, ${colorVariations.lighter.g}, ${colorVariations.lighter.b})` }">
          Lighter
        </div>
        <div class="rounded p-3 text-center text-xs" :style="{ backgroundColor: inputColor }">
          Base
        </div>
        <div class="rounded p-3 text-center text-xs" :style="{ backgroundColor: `rgb(${colorVariations.darker.r}, ${colorVariations.darker.g}, ${colorVariations.darker.b})` }">
          Darker
        </div>
      </div>
    </div>
  </div>
</template>
