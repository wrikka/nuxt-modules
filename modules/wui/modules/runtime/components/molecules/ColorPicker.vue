<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  presetColors?: string[]
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  presetColors: () => [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
    '#00ff88', '#ff0088', '#88ff00', '#0088ff', '#888888'
  ],
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [color: string]
}>()

const isOpen = ref(false)
const selectedColor = ref(_props.modelValue || '#000000')

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : null
}

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }).join('')}`
}

const rgbValues = computed(() => {
  const rgb = hexToRgb(selectedColor.value)
  return rgb || { r: 0, g: 0, b: 0 }
})

const _onColorChange = (color: string) => {
  selectedColor.value = color
  emit('update:modelValue', color)
}

const _onRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
  const rgb = { ...rgbValues.value, [channel]: value }
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  selectedColor.value = hex
  emit('update:modelValue', hex)
}

const _togglePicker = () => {
  if (!_props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const _classes = computed(() => [
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  _props.class
])
</script>

<template>
  <div class="relative">
    <div class="flex items-center space-x-2">
      <div
        class="h-6 w-6 rounded border border-border cursor-pointer"
        :style="{ backgroundColor: selectedColor }"
        @click="_togglePicker"
      />
      <input
        :class="_classes"
        :value="selectedColor"
        :disabled="_props.disabled"
        @input="_onColorChange(($event.target as HTMLInputElement).value)"
      />
    </div>
    
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-50 mt-1 rounded-md border bg-popover p-4 shadow-lg"
      >
        <div class="space-y-4">
          <!-- RGB Sliders -->
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <label class="text-xs font-medium w-4">R</label>
              <input
                type="range"
                min="0"
                max="255"
                :value="rgbValues.r"
                class="flex-1"
                @input="_onRgbChange('r', parseInt(($event.target as HTMLInputElement).value))"
              />
              <span class="text-xs w-8 text-right">{{ rgbValues.r }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <label class="text-xs font-medium w-4">G</label>
              <input
                type="range"
                min="0"
                max="255"
                :value="rgbValues.g"
                class="flex-1"
                @input="_onRgbChange('g', parseInt(($event.target as HTMLInputElement).value))"
              />
              <span class="text-xs w-8 text-right">{{ rgbValues.g }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <label class="text-xs font-medium w-4">B</label>
              <input
                type="range"
                min="0"
                max="255"
                :value="rgbValues.b"
                class="flex-1"
                @input="_onRgbChange('b', parseInt(($event.target as HTMLInputElement).value))"
              />
              <span class="text-xs w-8 text-right">{{ rgbValues.b }}</span>
            </div>
          </div>
          
          <!-- Preset Colors -->
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="color in _props.presetColors"
              :key="color"
              type="button"
              class="h-8 w-8 rounded border-2"
              :class="selectedColor === color ? 'border-primary' : 'border-border'"
              :style="{ backgroundColor: color }"
              @click="_onColorChange(color)"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
