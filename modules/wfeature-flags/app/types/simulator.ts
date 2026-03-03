export interface RolloutSimulation {
  id: string;
  flagKey: string;
  config: SimulationConfig;
  results: SimulationResult;
  createdAt: number;
}

export interface SimulationConfig {
  percentage: number;
  stickiness: 'userId' | 'sessionId' | 'random';
  sampleSize: number;
  userDistribution?: UserDistribution;
}

export interface UserDistribution {
  attribute: string;
  segments: { value: string; percentage: number; }[];
}

export interface SimulationResult {
  enabledCount: number;
  disabledCount: number;
  distributionBySegment: SegmentDistribution[];
  consistency: number;
  edgeCases: EdgeCase[];
}

export interface SegmentDistribution {
  segment: string;
  enabled: number;
  disabled: number;
  percentage: number;
}

export interface EdgeCase {
  type: 'boundary' | 'inconsistent' | 'unexpected';
  description: string;
  userId: string;
  expectedEnabled: boolean;
  actualEnabled: boolean;
}

export interface SimulationComparison {
  before: SimulationResult;
  after: SimulationResult;
  impact: SimulationImpact;
}

export interface SimulationImpact {
  usersAffected: number;
  segmentsChanged: string[];
  riskLevel: 'low' | 'medium' | 'high';
}
