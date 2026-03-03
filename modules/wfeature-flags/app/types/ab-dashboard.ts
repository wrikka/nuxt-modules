export interface ABTestDashboard {
  experiments: ExperimentSummary[];
  comparison: ExperimentComparison | null;
  dateRange: DateRange;
  filters: DashboardFilter;
}

export interface ExperimentSummary {
  id: string;
  key: string;
  name: string;
  status: ExperimentStatus;
  startDate: number;
  endDate?: number;
  variants: VariantSummary[];
  metrics: MetricSummary[];
  significance: SignificanceLevel;
  winner?: string;
}

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';

export type SignificanceLevel = 'none' | 'low' | 'medium' | 'high' | 'conclusive';

export interface VariantSummary {
  key: string;
  name: string;
  allocation: number;
  users: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  lift: number;
}

export interface MetricSummary {
  key: string;
  name: string;
  type: 'primary' | 'secondary';
  baseline: number;
  bestVariant: string;
  improvement: number;
}

export interface ExperimentComparison {
  experiments: string[];
  metrics: ComparisonMetric[];
  chartData: ComparisonChartData[];
}

export interface ComparisonMetric {
  key: string;
  values: { experimentId: string; value: number; }[];
  winner: string;
}

export interface ComparisonChartData {
  label: string;
  data: { experimentId: string; value: number; }[];
}

export interface DateRange {
  start: number;
  end: number;
  preset?: 'last7days' | 'last30days' | 'last90days' | 'custom';
}

export interface DashboardFilter {
  status?: ExperimentStatus[];
  search?: string;
  sortBy: 'name' | 'startDate' | 'significance' | 'users';
  sortOrder: 'asc' | 'desc';
}
