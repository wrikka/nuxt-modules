export interface UserJourney {
  id: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pages: JourneyPage[];
  events: JourneyEvent[];
  conversion?: JourneyConversion;
}

export interface JourneyPage {
  url: string;
  title: string;
  timestamp: Date;
  duration: number;
  scrollDepth: number;
  exitRate: number;
}

export interface JourneyEvent {
  name: string;
  timestamp: Date;
  page: string;
  properties: Record<string, unknown>;
}

export interface JourneyConversion {
  type: string;
  value: number;
  timestamp: Date;
  page: string;
}

export interface JourneyPattern {
  id: string;
  name: string;
  pattern: JourneyStep[];
  frequency: number;
  conversionRate: number;
  avgDuration: number;
}

export interface JourneyStep {
  type: 'page' | 'event';
  value: string;
  order: number;
}

export interface JourneyAnalysis {
  commonPaths: JourneyPattern[];
  dropOffPoints: DropOffPoint[];
  entryPages: PageStatistic[];
  exitPages: PageStatistic[];
  avgJourneyLength: number;
  avgJourneyDuration: number;
}

export interface DropOffPoint {
  page: string;
  dropOffRate: number;
  previousPage?: string;
  commonNextActions: string[];
}

export interface PageStatistic {
  url: string;
  title: string;
  visits: number;
  percentage: number;
  avgDuration: number;
}

export interface JourneyConfig {
  enabled: boolean;
  maxSteps: number;
  trackScrollDepth: boolean;
  trackExitRate: boolean;
}
