export interface CookielessConfig {
  enabled: boolean;
  method: CookielessMethod;
  fingerprinting: FingerprintingConfig;
  localStorage: LocalStorageConfig;
  sessionStorage: SessionStorageConfig;
}

export type CookielessMethod =
  | 'fingerprint'
  | 'local_storage'
  | 'session_storage'
  | 'indexeddb'
  | 'combination';

export interface FingerprintingConfig {
  enabled: boolean;
  components: FingerprintComponent[];
  hashFunction: 'sha256' | 'sha512' | 'murmur';
  privacyMode: 'strict' | 'balanced' | 'open';
  rotateInterval: number;
}

export type FingerprintComponent =
  | 'userAgent'
  | 'language'
  | 'colorDepth'
  | 'deviceMemory'
  | 'hardwareConcurrency'
  | 'screenResolution'
  | 'availableScreenResolution'
  | 'timezoneOffset'
  | 'timezone'
  | 'sessionStorage'
  | 'localStorage'
  | 'indexedDB'
  | 'openDatabase'
  | 'cpuClass'
  | 'platform'
  | 'plugins'
  | 'canvas'
  | 'webgl'
  | 'webglVendorAndRenderer'
  | 'adBlock'
  | 'hasLiedLanguages'
  | 'hasLiedResolution'
  | 'hasLiedOs'
  | 'hasLiedBrowser'
  | 'touchSupport'
  | 'fonts'
  | 'audio'
  | 'enumerateDevices';

export interface LocalStorageConfig {
  enabled: boolean;
  keyPrefix: string;
  expiry: number;
  fallbackToSession: boolean;
}

export interface SessionStorageConfig {
  enabled: boolean;
  keyPrefix: string;
  crossTab: boolean;
}

export interface VisitorIdentifier {
  id: string;
  visitorId?: string;
  method: CookielessMethod;
  createdAt: Date;
  lastSeen: Date;
  visitCount: number;
  isNew: boolean;
  confidence: number;
}

export interface CrossSessionData {
  visitorId: string;
  sessions: string[];
  firstVisit: Date;
  lastVisit: Date;
  totalPageViews: number;
  totalTime: number;
  deviceHistory: DeviceHistory[];
}

export interface DeviceHistory {
  fingerprint: string;
  firstSeen: Date;
  lastSeen: Date;
  visitCount: number;
}

export interface FingerprintComponents {
  userAgent?: string;
  language?: string;
  languages?: string[];
  screenResolution?: string;
  screenColorDepth?: number;
  pixelRatio?: number;
  timezone?: string;
  timezoneOffset?: number;
  platform?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  touchSupport?: boolean;
  cookieEnabled?: boolean;
  doNotTrack?: string;
  plugins?: string[];
  viewport?: string;
  canvasHash?: string;
  webglVendor?: string;
  webglRenderer?: string;
}
