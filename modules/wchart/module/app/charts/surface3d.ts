import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * 3D Surface Plot - Three-dimensional surface visualization
 */

/**
 * Generate 3D surface data from function or grid
 */
export function generate3DSurfaceData(
  xRange: { min: number; max: number; steps: number },
  zRange: { min: number; max: number; steps: number },
  heightFunction: (x: number, z: number) => number,
  options: {
    title?: string;
    colorScale?: string[];
    wireframe?: boolean;
  } = {},
): ChartData {
  const { title, colorScale, wireframe = false } = options;

  const xStep = (xRange.max - xRange.min) / xRange.steps;
  const zStep = (zRange.max - zRange.min) / zRange.steps;

  const points: Array<{
    x: number;
    y: number;
    z: number;
    color: string;
  }> = [];

  const yValues: number[] = [];

  // Generate grid points
  for (let zi = 0; zi <= zRange.steps; zi++) {
    for (let xi = 0; xi <= xRange.steps; xi++) {
      const x = xRange.min + xi * xStep;
      const z = zRange.min + zi * zStep;
      const y = heightFunction(x, z);

      yValues.push(y);
      points.push({ x, y, z, color: '' }); // Color will be set later
    }
  }

  // Calculate color based on height
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  const coloredPoints = points.map((p) => {
    const t = (p.y - minY) / yRange;
    const colorIndex = Math.floor(t * ((colorScale?.length || 10) - 1));
    const color = colorScale?.[colorIndex] || getSurfaceColor(t);

    return { ...p, color };
  });

  // Create series as triangles for surface
  const triangles: ChartSeries[] = [];

  for (let zi = 0; zi < zRange.steps; zi++) {
    for (let xi = 0; xi < xRange.steps; xi++) {
      const i = zi * (xRange.steps + 1) + xi;

      const p1 = coloredPoints[i];
      const p2 = coloredPoints[i + 1];
      const p3 = coloredPoints[i + xRange.steps + 1];
      const p4 = coloredPoints[i + xRange.steps + 2];

      if (p1 && p2 && p3) {
        triangles.push({
          name: `Triangle ${xi}-${zi}-A`,
          data: [
            { x: p1.x, y: p1.y, z: p1.z, color: p1.color },
            { x: p2.x, y: p2.y, z: p2.z, color: p2.color },
            { x: p3.x, y: p3.y, z: p3.z, color: p3.color },
          ],
          type: 'surface3d',
          color: p1.color,
        });
      }

      if (p2 && p3 && p4) {
        triangles.push({
          name: `Triangle ${xi}-${zi}-B`,
          data: [
            { x: p2.x, y: p2.y, z: p2.z, color: p2.color },
            { x: p3.x, y: p3.y, z: p3.z, color: p3.color },
            { x: p4.x, y: p4.y, z: p4.z, color: p4.color },
          ],
          type: 'surface3d',
          color: p2.color,
        });
      }
    }
  }

  if (wireframe) {
    // Add wireframe lines
    const lines: ChartSeries[] = [];

    // X lines
    for (let zi = 0; zi <= zRange.steps; zi++) {
      const lineData: DataPoint[] = [];
      for (let xi = 0; xi <= xRange.steps; xi++) {
        const i = zi * (xRange.steps + 1) + xi;
        const p = coloredPoints[i];
        if (p) {
          lineData.push({ x: p.x, y: p.y, z: p.z });
        }
      }
      lines.push({
        name: `X-Line ${zi}`,
        data: lineData,
        type: 'line3d',
        color: '#666',
      });
    }

    // Z lines
    for (let xi = 0; xi <= xRange.steps; xi++) {
      const lineData: DataPoint[] = [];
      for (let zi = 0; zi <= zRange.steps; zi++) {
        const i = zi * (xRange.steps + 1) + xi;
        const p = coloredPoints[i];
        if (p) {
          lineData.push({ x: p.x, y: p.y, z: p.z });
        }
      }
      lines.push({
        name: `Z-Line ${xi}`,
        data: lineData,
        type: 'line3d',
        color: '#666',
      });
    }

    return {
      title,
      series: [...triangles, ...lines],
    };
  }

  return {
    title,
    series: triangles,
  };
}

/**
 * Get surface color based on height
 */
function getSurfaceColor(t: number): string {
  // Blue to green to yellow to red
  if (t < 0.25) {
    return `rgb(0, ${Math.round(255 * t * 4)}, 255)`;
  } else if (t < 0.5) {
    return `rgb(0, 255, ${Math.round(255 * (1 - (t - 0.25) * 4))})`;
  } else if (t < 0.75) {
    return `rgb(${Math.round(255 * (t - 0.5) * 4)}, 255, 0)`;
  } else {
    return `rgb(255, ${Math.round(255 * (1 - (t - 0.75) * 4))}, 0)`;
  }
}

/**
 * Calculate surface normals for lighting
 */
export function calculateSurfaceNormals(
  triangles: Array<{
    data: Array<{ x: number; y: number; z: number }>;
  }>,
): Array<{ nx: number; ny: number; nz: number }> {
  return triangles.map((tri) => {
    const p1 = tri.data[0];
    const p2 = tri.data[1];
    const p3 = tri.data[2];

    if (!p1 || !p2 || !p3) {
      return { nx: 0, ny: 1, nz: 0 };
    }

    // Two vectors in the triangle
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };

    // Cross product
    const nx = v1.y * v2.z - v1.z * v2.y;
    const ny = v1.z * v2.x - v1.x * v2.z;
    const nz = v1.x * v2.y - v1.y * v2.x;

    // Normalize
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    if (len === 0) return { nx: 0, ny: 1, nz: 0 };

    return { nx: nx / len, ny: ny / len, nz: nz / len };
  });
}

/**
 * Sample surface functions
 */
export const surfaceFunctions = {
  sineWave: (x: number, z: number): number => Math.sin(x) * Math.cos(z),
  gaussian: (x: number, z: number): number => Math.exp(-(x * x + z * z) / 10),
  ripple: (x: number, z: number): number =>
    Math.sin(Math.sqrt(x * x + z * z)) / (Math.sqrt(x * x + z * z) + 0.1),
  saddle: (x: number, z: number): number => x * x - z * z,
  peaks: (x: number, z: number): number =>
    3 * (1 - x) ** 2 * Math.exp(-(x ** 2) - (z + 1) ** 2) -
    10 * (x / 5 - x ** 3 - z ** 5) * Math.exp(-x ** 2 - z ** 2) -
    1 / 3 * Math.exp(-(x + 1) ** 2 - z ** 2),
};
