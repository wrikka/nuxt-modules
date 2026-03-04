import type { Ref } from 'vue'

export interface GraphData {
  label: string
  value: number
  color?: string
}

export function useGraphData<T extends GraphData>(initialData: T[] = []): Ref<T[]> {
  const data = ref<T[]>(initialData)
  return data
}

export function useGraphScale(min: number, max: number, range: number) {
  const scale = (value: number): number => {
    return ((value - min) / (max - min || 1)) * range
  }
  return { scale }
}

export function useGraphColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 60%)`)
}
