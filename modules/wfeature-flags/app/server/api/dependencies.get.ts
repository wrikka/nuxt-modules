import { defineEventHandler, type H3Event } from 'h3';
import type { DependencyGraph } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const nodes = [
    {
      id: '1',
      key: 'new-dashboard',
      type: 'flag' as const,
      enabled: true,
      dependencies: [],
      dependents: ['premium-features'],
      level: 0,
    },
    {
      id: '2',
      key: 'premium-features',
      type: 'flag' as const,
      enabled: false,
      dependencies: ['new-dashboard'],
      dependents: ['api-v2'],
      level: 1,
    },
    {
      id: '3',
      key: 'api-v2',
      type: 'flag' as const,
      enabled: false,
      dependencies: ['premium-features'],
      dependents: [],
      level: 2,
    },
    { id: '4', key: 'dark-mode', type: 'flag' as const, enabled: true, dependencies: [], dependents: [], level: 0 },
    {
      id: '5',
      key: 'checkout-flow',
      type: 'experiment' as const,
      enabled: true,
      dependencies: ['new-dashboard'],
      dependents: [],
      level: 1,
    },
  ];

  const edges = [
    { id: 'e1', source: 'premium-features', target: 'new-dashboard', type: 'requires' as const },
    { id: 'e2', source: 'api-v2', target: 'premium-features', type: 'requires' as const },
    { id: 'e3', source: 'checkout-flow', target: 'new-dashboard', type: 'requires' as const },
  ];

  const graph: DependencyGraph = {
    nodes,
    edges,
    cycles: [],
    orphans: ['dark-mode'],
  };

  return graph;
});
