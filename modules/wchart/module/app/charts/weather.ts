import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Weather Chart - Multi-variable weather visualization
 */

/**
 * Generate weather chart data
 */
export function generateWeatherData(
  times: Date[],
  temperature: number[],
  humidity: number[],
  pressure: number[],
  windSpeed: number[],
  precipitation?: number[],
  options: {
    title?: string;
    showArea?: boolean;
  } = {},
): ChartData {
  const { title, showArea = true } = options;

  const series: ChartSeries[] = [
    // Temperature
    {
      name: 'Temperature',
      data: times.map((time, i) => ({
        x: time.toISOString(),
        y: temperature[i],
        unit: '°C',
        color: '#ff6384',
      })),
      type: 'line',
      color: '#ff6384',
    },
    // Humidity
    {
      name: 'Humidity',
      data: times.map((time, i) => ({
        x: time.toISOString(),
        y: humidity[i],
        unit: '%',
        color: '#36a2eb',
      })),
      type: showArea ? 'area' : 'line',
      color: '#36a2eb',
    },
    // Pressure (scaled)
    {
      name: 'Pressure',
      data: times.map((time, i) => ({
        x: time.toISOString(),
        y: (pressure[i] - 1000) / 10, // Scale to fit
        originalValue: pressure[i],
        unit: 'hPa',
        color: '#ffce56',
      })),
      type: 'line',
      color: '#ffce56',
    },
    // Wind Speed
    {
      name: 'Wind',
      data: times.map((time, i) => ({
        x: time.toISOString(),
        y: windSpeed[i],
        unit: 'km/h',
        color: '#4bc0c0',
      })),
      type: 'bar',
      color: '#4bc0c0',
    },
  ];

  // Precipitation if provided
  if (precipitation) {
    series.push({
      name: 'Rain',
      data: times.map((time, i) => ({
        x: time.toISOString(),
        y: precipitation[i],
        unit: 'mm',
        color: '#9966ff',
      })),
      type: 'bar',
      color: '#9966ff',
    });
  }

  return {
    title,
    series,
  };
}

/**
 * Calculate weather statistics
 */
export function calculateWeatherStats(
  temperature: number[],
  humidity: number[],
  pressure: number[],
  windSpeed: number[],
): {
  temp: { min: number; max: number; avg: number; range: number };
  humidity: { min: number; max: number; avg: number };
  pressure: { trend: 'rising' | 'falling' | 'steady'; change: number };
  wind: { avg: number; max: number };
  comfort: { heatIndex: number; windChill: number };
} {
  const tempMin = Math.min(...temperature);
  const tempMax = Math.max(...temperature);
  const tempAvg = temperature.reduce((sum, t) => sum + t, 0) / temperature.length;

  const humAvg = humidity.reduce((sum, h) => sum + h, 0) / humidity.length;

  const pressChange = pressure[pressure.length - 1] - pressure[0];
  const pressTrend = pressChange > 2 ? 'rising' : pressChange < -2 ? 'falling' : 'steady';

  const windAvg = windSpeed.reduce((sum, w) => sum + w, 0) / windSpeed.length;
  const windMax = Math.max(...windSpeed);

  // Heat index approximation
  const heatIndex = tempAvg + 0.5555 * (6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.16 + humAvg * 0.01))) - 10);

  // Wind chill
  const windChill = 13.12 + 0.6215 * tempAvg - 11.37 * Math.pow(windAvg, 0.16) + 0.3965 * tempAvg * Math.pow(windAvg, 0.16);

  return {
    temp: { min: tempMin, max: tempMax, avg: tempAvg, range: tempMax - tempMin },
    humidity: { min: Math.min(...humidity), max: Math.max(...humidity), avg: humAvg },
    pressure: { trend: pressTrend, change: pressChange },
    wind: { avg: windAvg, max: windMax },
    comfort: { heatIndex, windChill },
  };
}

/**
 * Detect weather patterns
 */
export function detectWeatherPatterns(
  temp: number[],
  pressure: number[],
  humidity: number[],
): Array<{
  type: 'front' | 'storm' | 'clear' | 'change';
  index: number;
  description: string;
}> {
  const patterns: Array<{ type: 'front' | 'storm' | 'clear' | 'change'; index: number; description: string }> = [];

  for (let i = 1; i < temp.length; i++) {
    const tempChange = temp[i] - temp[i - 1];
    const pressChange = pressure[i] - pressure[i - 1];
    const humChange = humidity[i] - humidity[i - 1];

    // Cold front: temp drops, pressure rises
    if (tempChange < -3 && pressChange > 3) {
      patterns.push({
        type: 'front',
        index: i,
        description: 'Cold front passage',
      });
    }

    // Warm front: temp rises, humidity increases
    if (tempChange > 3 && humChange > 10) {
      patterns.push({
        type: 'front',
        index: i,
        description: 'Warm front approach',
      });
    }

    // Storm: pressure drops rapidly
    if (pressChange < -5) {
      patterns.push({
        type: 'storm',
        index: i,
        description: 'Low pressure system',
      });
    }

    // Clear: pressure steady, humidity low
    if (Math.abs(pressChange) < 1 && humidity[i] < 40) {
      patterns.push({
        type: 'clear',
        index: i,
        description: 'Stable clear conditions',
      });
    }
  }

  return patterns;
}
