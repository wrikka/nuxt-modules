import type { DeviceType, PrivacyMode } from './common';

export interface SessionRecording {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  pageViews: number;
  events: SessionEvent[];
  metadata: SessionMetadata;
}

export interface SessionEvent {
  type: SessionEventType;
  timestamp: number;
  data: Record<string, unknown>;
  selector?: string;
  x?: number;
  y?: number;
}

export type SessionEventType =
  | 'click'
  | 'scroll'
  | 'input'
  | 'navigation'
  | 'resize'
  | 'mutation'
  | 'keypress'
  | 'select'
  | 'copy'
  | 'paste';

export interface SessionMetadata {
  url: string;
  title: string;
  referrer?: string;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  deviceType: DeviceType;
  browser: string;
  os: string;
  country?: string;
  city?: string;
}

export interface SessionReplayConfig {
  enabled: boolean;
  sampleRate: number;
  maskAllInputs: boolean;
  maskTextSelector?: string;
  blockSelector?: string;
  ignoreSelector?: string;
  recordCanvas: boolean;
  recordImages: boolean;
  maxDuration: number;
  privacyMode: PrivacyMode;
}

export interface SessionFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  url?: string;
  deviceType?: DeviceType;
  country?: string;
  minDuration?: number;
  maxDuration?: number;
  hasErrors?: boolean;
}
