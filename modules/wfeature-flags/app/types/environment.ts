export interface Environment {
  id: string;
  name: string;
  key: string;
  description?: string;
  isDefault: boolean;
  createdAt: number;
}

export interface EnvironmentConfig {
  enabled: boolean;
  current: string;
  environments: Environment[];
}

export interface EnvironmentFilter {
  environmentKey?: string;
}
