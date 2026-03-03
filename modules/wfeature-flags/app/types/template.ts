export interface FlagTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  config: FlagTemplateConfig;
  tags: string[];
}

export type TemplateCategory =
  | 'ui'
  | 'performance'
  | 'security'
  | 'beta'
  | 'maintenance'
  | 'integration';

export interface FlagTemplateConfig {
  key: string;
  enabled: boolean;
  rollout?: {
    percentage: number;
    stickiness: 'userId' | 'sessionId' | 'random';
  };
  targeting?: {
    attribute: string;
    operator: string;
    value: unknown;
  }[];
  variants?: {
    name: string;
    value: unknown;
    weight: number;
  }[];
}

export const FLAG_TEMPLATES: FlagTemplate[] = [
  {
    id: 'dark-mode',
    name: 'Dark Mode Toggle',
    description: 'Enable dark mode for users who prefer it',
    category: 'ui',
    config: {
      key: 'dark-mode',
      enabled: false,
      rollout: { percentage: 100, stickiness: 'userId' },
    },
    tags: ['ui', 'theme', 'user-preference'],
  },
  {
    id: 'beta-feature',
    name: 'Beta Feature',
    description: 'Enable beta features for early adopters',
    category: 'beta',
    config: {
      key: 'beta-feature',
      enabled: false,
      rollout: { percentage: 10, stickiness: 'userId' },
      targeting: [{ attribute: 'betaTester', operator: 'eq', value: true }],
    },
    tags: ['beta', 'early-access'],
  },
  {
    id: 'maintenance-mode',
    name: 'Maintenance Mode',
    description: 'Put the application in maintenance mode',
    category: 'maintenance',
    config: {
      key: 'maintenance-mode',
      enabled: false,
    },
    tags: ['maintenance', 'admin'],
  },
  {
    id: 'new-dashboard',
    name: 'New Dashboard',
    description: 'Roll out new dashboard design',
    category: 'ui',
    config: {
      key: 'new-dashboard',
      enabled: false,
      rollout: { percentage: 50, stickiness: 'userId' },
    },
    tags: ['ui', 'dashboard', 'redesign'],
  },
  {
    id: 'performance-optimization',
    name: 'Performance Optimization',
    description: 'Enable performance optimizations',
    category: 'performance',
    config: {
      key: 'perf-opt',
      enabled: true,
    },
    tags: ['performance', 'optimization'],
  },
  {
    id: 'security-enhancement',
    name: 'Security Enhancement',
    description: 'Enable additional security features',
    category: 'security',
    config: {
      key: 'security-enhanced',
      enabled: false,
      targeting: [{ attribute: 'role', operator: 'in', value: ['admin', 'moderator'] }],
    },
    tags: ['security', 'admin'],
  },
  {
    id: 'api-v2',
    name: 'API v2 Migration',
    description: 'Gradually migrate users to API v2',
    category: 'integration',
    config: {
      key: 'api-v2',
      enabled: false,
      rollout: { percentage: 25, stickiness: 'userId' },
    },
    tags: ['api', 'migration', 'integration'],
  },
  {
    id: 'premium-features',
    name: 'Premium Features',
    description: 'Enable premium features for paid users',
    category: 'beta',
    config: {
      key: 'premium-features',
      enabled: false,
      targeting: [{ attribute: 'plan', operator: 'eq', value: 'premium' }],
    },
    tags: ['premium', 'subscription', 'monetization'],
  },
];
