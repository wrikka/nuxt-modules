import type { DateRange } from './common';

export interface Prediction {
  id: string;
  type: PredictionType;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: Date;
  factors: PredictionFactor[];
}

export type PredictionType =
  | 'traffic'
  | 'conversion'
  | 'revenue'
  | 'churn'
  | 'engagement'
  | 'bounce_rate';

export interface PredictionFactor {
  name: string;
  impact: number;
  direction: 'positive' | 'negative';
}

export interface ChurnPrediction {
  userId: string;
  churnProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  signals: ChurnSignal[];
  recommendedActions: string[];
  lastActive: Date;
  engagementScore: number;
}

export interface ChurnSignal {
  type: string;
  description: string;
  weight: number;
  detectedAt: Date;
}

export interface ConversionPrediction {
  sessionId: string;
  conversionProbability: number;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'very_likely';
  intentSignals: IntentSignal[];
  predictedValue: number;
  predictedProducts?: string[];
}

export interface IntentSignal {
  type: string;
  strength: number;
  data: Record<string, unknown>;
}

export interface TrendForecast {
  metric: string;
  period: DateRange;
  forecast: ForecastPoint[];
  confidenceInterval: {
    lower: number[];
    upper: number[];
  };
  seasonality: SeasonalPattern[];
}

export interface ForecastPoint {
  date: Date;
  value: number;
  confidence: number;
}

export interface SeasonalPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  pattern: number[];
  peakDay?: number;
  peakHour?: number;
}

export interface PredictiveAnalyticsConfig {
  enabled: boolean;
  modelType: 'linear' | 'prophet' | 'lstm' | 'ensemble';
  retrainFrequency: 'daily' | 'weekly';
  minDataPoints: number;
  confidenceThreshold: number;
}
