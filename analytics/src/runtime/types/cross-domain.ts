export interface CrossDomainConfig {
  enabled: boolean;
  domains: DomainConfig[];
  linkingMethod: LinkingMethod;
  timeout: number;
}

export type LinkingMethod =
  | 'url_parameter'
  | 'post_message'
  | 'shared_storage'
  | 'server_side';

export interface DomainConfig {
  domain: string;
  primary: boolean;
  shareSession: boolean;
  shareUser: boolean;
  shareEvents: boolean;
}

export interface CrossDomainLink {
  sourceDomain: string;
  targetDomain: string;
  visitorId: string;
  sessionId: string;
  linkedAt: Date;
  method: LinkingMethod;
}

export interface CrossDomainSession {
  id: string;
  visitorId: string;
  domains: DomainSession[];
  startTime: Date;
  endTime?: Date;
  totalPageViews: number;
  totalEvents: number;
}

export interface DomainSession {
  domain: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  events: number;
  entryPage: string;
  exitPage?: string;
}

export interface CrossDomainJourney {
  visitorId: string;
  sessions: CrossDomainSession[];
  domains: string[];
  totalDuration: number;
  conversions: CrossDomainConversion[];
}

export interface CrossDomainConversion {
  id: string;
  type: string;
  value: number;
  sourceDomain: string;
  conversionDomain: string;
  timestamp: Date;
  attribution: AttributionData;
}

export interface AttributionData {
  firstTouch: AttributionPoint;
  lastTouch: AttributionPoint;
  touchpoints: AttributionPoint[];
  model: AttributionModel;
}

export type AttributionModel =
  | 'first_touch'
  | 'last_touch'
  | 'linear'
  | 'time_decay'
  | 'position_based'
  | 'data_driven';

export interface AttributionPoint {
  domain: string;
  url: string;
  timestamp: Date;
  campaign?: string;
  source?: string;
  medium?: string;
  content?: string;
  term?: string;
}

export interface CrossDomainMessage {
  type: string;
  source: string;
  target: string;
  visitorId?: string;
  sessionId?: string;
  timestamp: Date;
}

export type CrossDomainEvent = 'link_request' | 'link_success' | 'link_failed' | 'session_sync' | 'event_sync';
