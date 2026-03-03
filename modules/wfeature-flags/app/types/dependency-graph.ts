export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  cycles: DependencyCycle[];
  orphans: string[];
}

export interface DependencyNode {
  id: string;
  key: string;
  type: 'flag' | 'experiment';
  enabled: boolean;
  dependencies: string[];
  dependents: string[];
  level: number;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: 'requires' | 'blocks' | 'enables';
  condition?: string;
}

export interface DependencyCycle {
  nodes: string[];
  type: 'circular' | 'self';
  severity: 'warning' | 'error';
}

export interface DependencyValidation {
  valid: boolean;
  errors: DependencyError[];
  warnings: DependencyWarning[];
}

export interface DependencyError {
  flagKey: string;
  type: 'cycle' | 'missing' | 'invalid';
  message: string;
  affectedFlags: string[];
}

export interface DependencyWarning {
  flagKey: string;
  type: 'depth' | 'complexity' | 'disabled-dependency';
  message: string;
  suggestion: string;
}

export interface GraphLayout {
  nodes: { id: string; x: number; y: number; }[];
  width: number;
  height: number;
}
