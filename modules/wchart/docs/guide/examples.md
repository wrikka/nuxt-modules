<script setup>
import BarChart from '@/components/BarChart.vue'
import ChartContainer from '@/components/ChartContainer.vue'
import ChartLegend from '@/components/ChartLegend.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import ResponsiveChartWrapper from '@/components/ResponsiveChartWrapper.vue'
import LineChart from '@/components/LineChart.vue'
import PieChart from '@/components/PieChart.vue'
import AreaChart from '@/components/AreaChart.vue'

const barData = [
  { x: 'Jan', y: 100 },
  { x: 'Feb', y: 150 },
  { x: 'Mar', y: 120 }
]

const lineData = [
  { x: 'Jan', y: 200 },
  { x: 'Feb', y: 250 },
  { x: 'Mar', y: 220 }
]

const areaData = [
  { x: 'Jan', y: 150 },
  { x: 'Feb', y: 200 },
  { x: 'Mar', y: 180 }
]

const pieData = [
  { label: 'Category A', value: 30, color: '#ef4444' },
  { label: 'Category B', value: 50, color: '#3b82f6' },
  { label: 'Category C', value: 20, color: '#10b981' }
]
</script>

# Examples

## Basic Chart

<ChartContainer title="Monthly Sales">
  <BarChart :data="barData" />
</ChartContainer>

<ChartLegend :series="[{ name: 'Sales', color: '#3b82f6' }]" />

## Themed Chart with Export

<ThemeToggle />

<ChartContainer title="Revenue">
  <LineChart :data="lineData" />
</ChartContainer>

<ExportPanel :chartData="{ series: [{ name: 'Revenue', data: lineData }] }" />

## Responsive Chart

<ResponsiveChartWrapper :chartData="{ series: [{ name: 'Sales', data: barData }] }">
  <BarChart :data="barData" />
</ResponsiveChartWrapper>

## Using Multiple Chart Types

<div class="grid grid-cols-2 gap-4">
  <ChartContainer title="Bar Chart">
    <BarChart :data="barData" />
  </ChartContainer>

  <ChartContainer title="Line Chart">
    <LineChart :data="lineData" />
  </ChartContainer>

  <ChartContainer title="Area Chart">
    <AreaChart :data="areaData" />
  </ChartContainer>

  <ChartContainer title="Pie Chart">
    <PieChart :data="pieData" />
  </ChartContainer>
</div>
