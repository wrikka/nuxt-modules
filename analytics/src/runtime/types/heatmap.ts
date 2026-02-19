import type { DateRange } from './common';

export interface HeatmapData {
  id: string;
  type: HeatmapType;
  url: string;
  dateRange: DateRange;
  data: HeatmapPoint[];
  summary: HeatmapSummary;
}

export type HeatmapType = 'click' | 'move' | 'scroll' | 'attention';

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  selector?: string;
  element?: string;
}

export interface HeatmapSummary {
  totalInteractions: number;
  maxIntensity: number;
  avgIntensity: number;
  hotspots: HeatmapHotspot[];
  deadzones: HeatmapDeadzone[];
}

export interface HeatmapHotspot {
  selector: string;
  x: number;
  y: number;
  interactions: number;
  percentage: number;
}

export interface HeatmapDeadzone {
  selector: string;
  x: number;
  y: number;
  width: number;
  height: number;
  reason: string;
}

export interface ScrollData {
  url: string;
  avgScrollDepth: number;
  maxScrollDepth: number;
  scrollDistribution: ScrollDistribution[];
  foldPosition: number;
}

export interface ScrollDistribution {
  percentage: number;
  users: number;
  cumulativeUsers: number;
}

export interface AttentionData {
  url: string;
  elements: ElementAttention[];
  avgTimeOnPage: number;
}

export interface ElementAttention {
  selector: string;
  visibleTime: number;
  visiblePercentage: number;
  avgViewTime: number;
}

export interface HeatmapConfig {
  enabled: boolean;
  sampleRate: number;
  types: HeatmapType[];
  resolution: number;
  minInteractions: number;
  privacyMode: 'strict' | 'balanced' | 'relaxed';
  captureClicks?: boolean;
  captureMoves?: boolean;
}
