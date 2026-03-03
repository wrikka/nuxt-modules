export interface FlagImpact {
  flagKey: string;
  affectedPages: AffectedPage[];
  affectedComponents: AffectedComponent[];
  affectedRoutes: AffectedRoute[];
  usageCount: number;
  lastUsed?: number;
}

export interface AffectedPage {
  path: string;
  name: string;
  lineNumbers: number[];
}

export interface AffectedComponent {
  name: string;
  filePath: string;
  lineNumbers: number[];
  usageType: 'conditional' | 'variant' | 'experiment';
}

export interface AffectedRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string;
}

export interface ImpactAnalysisResult {
  flagKey: string;
  analyzedAt: number;
  summary: ImpactSummary;
  details: FlagImpact;
}

export interface ImpactSummary {
  totalPages: number;
  totalComponents: number;
  totalRoutes: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}
