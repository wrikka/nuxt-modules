import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Wind Rose Chart - Shows wind direction and speed distribution
 */

/**
 * Generate wind rose chart data
 */
export function generateWindRoseData(
  directions: number[], // 0-360 degrees
  speeds: number[],
  options: {
    title?: string;
    numDirections?: number; // Number of direction sectors
    speedBands?: number[]; // Speed ranges for coloring
    colorScheme?: string[];
  } = {},
): ChartData {
  const { title, numDirections = 16, speedBands = [5, 10, 15, 20], colorScheme } = options;

  // Initialize sectors
  const sectorSize = 360 / numDirections;
  const sectors = Array.from({ length: numDirections }, (_, i) => ({
    angle: i * sectorSize,
    counts: Array(speedBands.length + 1).fill(0),
    total: 0,
  }));

  // Distribute data into sectors
  for (let i = 0; i < directions.length; i++) {
    const dir = directions[i] ?? 0;
    const speed = speeds[i] ?? 0;

    const sectorIndex = Math.floor(dir / sectorSize) % numDirections;
    const sector = sectors[sectorIndex];

    if (sector) {
      // Find speed band
      let bandIndex = 0;
      for (let j = 0; j < speedBands.length; j++) {
        if (speed > (speedBands[j] ?? 0)) {
          bandIndex = j + 1;
        }
      }
      sector.counts[bandIndex] = (sector.counts[bandIndex] || 0) + 1;
      sector.total++;
    }
  }

  // Create series for each speed band
  const series: ChartSeries[] = speedBands.map((band, bandIndex) => {
    const data: DataPoint[] = sectors.map((sector) => {
      const count = sector.counts[bandIndex + 1] || 0;
      const radius = Math.sqrt(count) * 10; // Scale radius by sqrt of count

      return {
        x: sector.angle,
        y: radius,
        count,
        angle: sector.angle,
        speedBand: band,
        color: colorScheme?.[bandIndex] || getSeriesColor(bandIndex),
      };
    });

    return {
      name: `${band}+ knots`,
      data,
      type: 'windrose',
      color: colorScheme?.[bandIndex] || getSeriesColor(bandIndex),
    };
  });

  // Add calm (center circle)
  const calmCount = sectors.reduce((sum, s) => sum + (s.counts[0] || 0), 0);
  if (calmCount > 0) {
    series.unshift({
      name: 'Calm',
      data: sectors.map((s) => ({
        x: s.angle,
        y: Math.sqrt(calmCount / numDirections) * 5,
        count: calmCount / numDirections,
        isCalm: true,
      })),
      type: 'windrose',
      color: '#cccccc',
    });
  }

  return {
    title,
    series,
  };
}

/**
 * Calculate wind statistics
 */
export function calculateWindStats(
  directions: number[],
  speeds: number[],
): {
  prevailingDirection: number;
  avgSpeed: number;
  maxSpeed: number;
  calmPercentage: number;
  speedDistribution: number[];
} {
  const calmCount = speeds.filter((s) => s < 1).length;
  const calmPercentage = (calmCount / speeds.length) * 100;

  const activeSpeeds = speeds.filter((s) => s >= 1);
  const avgSpeed = activeSpeeds.length > 0
    ? activeSpeeds.reduce((sum, s) => sum + s, 0) / activeSpeeds.length
    : 0;
  const maxSpeed = Math.max(...speeds, 0);

  // Find prevailing direction (modal)
  const dirCounts = new Map<number, number>();
  directions.forEach((dir) => {
    const sector = Math.floor(dir / 22.5) * 22.5;
    dirCounts.set(sector, (dirCounts.get(sector) || 0) + 1);
  });
  const prevailingDirection = Array.from(dirCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

  // Speed distribution
  const speedDistribution = [
    activeSpeeds.filter((s) => s < 5).length,
    activeSpeeds.filter((s) => s >= 5 && s < 10).length,
    activeSpeeds.filter((s) => s >= 10 && s < 15).length,
    activeSpeeds.filter((s) => s >= 15 && s < 20).length,
    activeSpeeds.filter((s) => s >= 20).length,
  ];

  return {
    prevailingDirection,
    avgSpeed,
    maxSpeed,
    calmPercentage,
    speedDistribution,
  };
}

/**
 * Generate synthetic wind data for testing
 */
export function generateSyntheticWindData(
  n: number,
  prevailingDir: number = 270,
  dirSpread: number = 30,
  avgSpeed: number = 12,
): { directions: number[]; speeds: number[] } {
  const directions: number[] = [];
  const speeds: number[] = [];

  for (let i = 0; i < n; i++) {
    // Von Mises distribution approximation for direction
    const u = Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    const dir = (prevailingDir + z * dirSpread + 360) % 360;

    // Weibull distribution for speed
    const shape = 2;
    const scale = avgSpeed / Math.gamma(1 + 1 / shape);
    const speed = scale * Math.pow(-Math.log(Math.random()), 1 / shape);

    directions.push(dir);
    speeds.push(speed);
  }

  return { directions, speeds };
}
