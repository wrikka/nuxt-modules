import type { DateRange, DeviceType } from './common';

export interface DeviceInfo {
  type: DeviceType;
  brand?: string;
  model?: string;
  screenWidth: number;
  screenHeight: number;
  screenDensity: number;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  touchSupport: boolean;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  engine?: string;
  engineVersion?: string;
  screen?: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
    orientation: string;
  };
  viewport?: {
    width: number;
    height: number;
  };
  language?: string;
  languages?: string[];
  timezone?: string;
  cookiesEnabled?: boolean;
  doNotTrack?: boolean;
  plugins?: string[];
  connection?: {
    type?: string;
    downlink?: number;
    rtt?: number;
  };
  hardwareConcurrency?: number;
  deviceMemory?: number;
}

export interface BrowserInfo {
  name: string;
  version: string;
  majorVersion: number;
  engine: string;
  engineVersion: string;
  language: string;
  languages: string[];
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  plugins: string[];
}

export interface OSInfo {
  name: string;
  version: string;
  platform: string;
  architecture: string;
}

export interface DeviceAnalytics {
  period: DateRange;
  devices: DeviceStatistic[];
  browsers: BrowserData[];
  os: OSData[];
  screens: ScreenData[];
  summary: DeviceSummary;
}

export interface DeviceStatistic {
  type: DeviceType;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  percentage: number;
}

export interface BrowserStatistic {
  name: string;
  version: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  percentage: number;
}

export interface OSStatistic {
  name: string;
  version: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  percentage: number;
}

export interface ScreenStatistic {
  resolution: string;
  visitors: number;
  percentage: number;
  avgViewport: string;
}

export interface DeviceSummary {
  topDevice: DeviceType;
  topBrowser: string;
  topOS: string;
  topResolution: string;
  mobilePercentage: number;
  desktopPercentage: number;
  tabletPercentage: number;
}

export interface BrowserData {
  browser: string;
  version: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface OSData {
  os: string;
  version?: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface ScreenData {
  resolution: string;
  visitors: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface DeviceConfig {
  enabled: boolean;
  trackScreen: boolean;
  trackViewport: boolean;
  trackPlugins: boolean;
  trackLanguage: boolean;
}
