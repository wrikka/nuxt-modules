import { readonly, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface UsageData {
  hour: number
  day: number
  count: number
}

export interface HeatmapCell {
  day: string
  hour: number
  intensity: number
}

/**
 * Usage Heatmap - Visualize command usage patterns
 */
export function useUsageHeatmap() {
  const usageData = useLocalStorage<UsageData[]>('palette:usage-heatmap', [])
  const isGenerating = ref(false)

  const recordUsage = (commandId: string) => {
    const now = new Date()
    const entry: UsageData = {
      hour: now.getHours(),
      day: now.getDay(),
      count: 1
    }

    const existing = usageData.value.find(d => d.hour === entry.hour && d.day === entry.day)
    if (existing) {
      existing.count++
    }
    else {
      usageData.value.push(entry)
    }
  }

  const generateHeatmap = (): HeatmapCell[] => {
    isGenerating.value = true
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const maxCount = Math.max(...usageData.value.map(d => d.count), 1)

    const cells: HeatmapCell[] = []
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const data = usageData.value.find(d => d.day === day && d.hour === hour)
        cells.push({
          day: days[day],
          hour,
          intensity: data ? (data.count / maxCount) : 0
        })
      }
    }

    isGenerating.value = false
    return cells
  }

  const getPeakUsageTime = (): { day: string; hour: number } | null => {
    if (usageData.value.length === 0) return null

    const peak = usageData.value.reduce((max, curr) => curr.count > max.count ? curr : max)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return { day: days[peak.day], hour: peak.hour }
  }

  const getWeeklyStats = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map((day, idx) => ({
      day,
      total: usageData.value
        .filter(d => d.day === idx)
        .reduce((sum, d) => sum + d.count, 0)
    }))
  }

  const clearData = () => {
    usageData.value = []
  }

  return {
    usageData: readonly(usageData),
    isGenerating: readonly(isGenerating),
    recordUsage,
    generateHeatmap,
    getPeakUsageTime,
    getWeeklyStats,
    clearData
  }
}
