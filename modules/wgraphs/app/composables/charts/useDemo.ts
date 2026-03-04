import type { Ref } from 'vue'

export interface DemoConfig {
  title: string
  component: string
  data: unknown[]
}

export function useDemoData(): Ref<DemoConfig[]> {
  const demos = ref<DemoConfig[]>([
    { title: 'Bar Chart', component: 'GraphBar', data: [] },
    { title: 'Line Chart', component: 'GraphLine', data: [] },
    { title: 'Pie Chart', component: 'GraphPie', data: [] }
  ])
  return demos
}
