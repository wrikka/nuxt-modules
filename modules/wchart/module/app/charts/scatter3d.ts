import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * 3D Scatter Plot - Three-dimensional point cloud
 */

/**
 * Generate 3D scatter plot data
 */
export function generate3DScatterData(
  points: Array<{
    x: number;
    y: number;
    z: number;
    size?: number;
    color?: string;
    label?: string;
  }>,
  options: {
    title?: string;
    perspective?: number;
    rotation?: { x: number; y: number; z: number };
    sizeScale?: number;
  } = {},
): ChartData {
  const { title, perspective = 0.5, rotation = { x: 0, y: 0, z: 0 }, sizeScale = 1 } = options;

  // Apply rotation
  const rotatedPoints = points.map((point) => {
    const { x, y, z } = rotate3DPoint(point.x, point.y, point.z, rotation);

    // Apply perspective
    const scale = 1 / (1 + z * perspective * 0.01);

    return {
      ...point,
      x: x * scale,
      y: y * scale,
      z,
      projectedX: x * scale,
      projectedY: y * scale,
      projectedSize: (point.size || 5) * scale * sizeScale,
    };
  });

  // Sort by Z for proper occlusion
  rotatedPoints.sort((a, b) => b.z - a.z);

  const data: DataPoint[] = rotatedPoints.map((point, index) => ({
    x: point.projectedX,
    y: point.projectedY,
    z: point.z,
    originalX: point.x,
    originalY: point.y,
    size: point.projectedSize,
    color: point.color || getSeriesColor(index % 10),
    label: point.label,
  }));

  return {
    title,
    series: [
      {
        name: '3D Scatter',
        data,
        type: 'scatter3d',
      },
    ],
  };
}

/**
 * Rotate a 3D point
 */
function rotate3DPoint(
  x: number,
  y: number,
  z: number,
  rotation: { x: number; y: number; z: number },
): { x: number; y: number; z: number } {
  // Rotate around X axis
  let { x: rx, y: ry, z: rz } = { x, y, z };

  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const y1 = ry * cosX - rz * sinX;
  const z1 = ry * sinX + rz * cosX;
  ry = y1;
  rz = z1;

  // Rotate around Y axis
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);
  const x1 = rx * cosY + rz * sinY;
  const z2 = -rx * sinY + rz * cosY;
  rx = x1;
  rz = z2;

  // Rotate around Z axis
  const cosZ = Math.cos(rotation.z);
  const sinZ = Math.sin(rotation.z);
  const x2 = rx * cosZ - ry * sinZ;
  const y2 = rx * sinZ + ry * cosZ;
  rx = x2;
  ry = y2;

  return { x: rx, y: ry, z: rz };
}

/**
 * Generate 3D scatter with clusters
 */
export function generate3DClusteredScatter(
  clusters: Array<{
    name: string;
    center: { x: number; y: number; z: number };
    points: number;
    spread: number;
    color?: string;
  }>,
  options: {
    title?: string;
  } = {},
): ChartData {
  const { title } = options;

  const allPoints: Array<{
    x: number;
    y: number;
    z: number;
    cluster: string;
    color: string;
  }> = [];

  clusters.forEach((cluster) => {
    for (let i = 0; i < cluster.points; i++) {
      const x = cluster.center.x + (Math.random() - 0.5) * cluster.spread;
      const y = cluster.center.y + (Math.random() - 0.5) * cluster.spread;
      const z = cluster.center.z + (Math.random() - 0.5) * cluster.spread;

      allPoints.push({
        x,
        y,
        z,
        cluster: cluster.name,
        color: cluster.color || getSeriesColor(clusters.indexOf(cluster)),
      });
    }
  });

  return generate3DScatterData(allPoints, { title });
}

/**
 * Calculate 3D bounding box
 */
export function calculate3DBoundingBox(
  points: Array<{ x: number; y: number; z: number }>,
): {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
} {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const zs = points.map((p) => p.z);

  const min = {
    x: Math.min(...xs),
    y: Math.min(...ys),
    z: Math.min(...zs),
  };

  const max = {
    x: Math.max(...xs),
    y: Math.max(...ys),
    z: Math.max(...zs),
  };

  const center = {
    x: (min.x + max.x) / 2,
    y: (min.y + max.y) / 2,
    z: (min.z + max.z) / 2,
  };

  return {
    min,
    max,
    center,
    dimensions: {
      width: max.x - min.x,
      height: max.y - min.y,
      depth: max.z - min.z,
    },
  };
}

/**
 * Project 3D point to 2D
 */
export function project3DTo2D(
  point: { x: number; y: number; z: number },
  camera: {
    position: { x: number; y: number; z: number };
    target: { x: number; y: number; z: number };
    fov: number;
  },
): { x: number; y: number; depth: number } {
  // Vector from camera to point
  const dx = point.x - camera.position.x;
  const dy = point.y - camera.position.y;
  const dz = point.z - camera.position.z;

  // Distance
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Normalize
  const nx = dx / distance;
  const ny = dy / distance;
  const nz = dz / distance;

  // View vector
  const vx = camera.target.x - camera.position.x;
  const vy = camera.target.y - camera.position.y;
  const vz = camera.target.z - camera.position.z;
  const vLen = Math.sqrt(vx * vx + vy * vy + vz * vz);

  // Dot product for visibility
  const dot = (nx * vx + ny * vy + nz * vz) / vLen;

  if (dot < 0) {
    // Behind camera
    return { x: 0, y: 0, depth: -1 };
  }

  // Simple perspective projection
  const scale = (camera.fov / distance) * 100;

  return {
    x: nx * scale,
    y: ny * scale,
    depth: distance,
  };
}
