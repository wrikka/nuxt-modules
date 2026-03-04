import { defineEventHandler } from 'h3'

interface ChartComponent {
  name: string
  description: string
  category: 'bar' | 'line' | 'pie' | 'radar'
  props: string[]
}

export default defineEventHandler((): ChartComponent[] => {
  return [
    {
      name: 'WBarChart',
      description: 'Interactive bar chart with animations, gradients, and customizable colors',
      category: 'bar',
      props: ['data', 'title', 'height', 'animated', 'showLabels', 'showValues'],
    },
    {
      name: 'WLineChart',
      description: 'Smooth line chart with area fill, grid lines, and animated data points',
      category: 'line',
      props: ['data', 'title', 'height', 'animated', 'showArea', 'showPoints'],
    },
    {
      name: 'WPieChart',
      description: 'Beautiful pie chart with percentage labels and color legend',
      category: 'pie',
      props: ['data', 'title', 'height', 'animated', 'showLegend'],
    },
    {
      name: 'WRadarChart',
      description: 'Radar/spider chart for multi-dimensional data visualization',
      category: 'radar',
      props: ['data', 'title', 'height', 'animated', 'fillOpacity'],
    },
  ]
})
