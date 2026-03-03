<script setup lang="ts">
import { ref, computed } from '#imports';
import type { DependencyGraph, DependencyNode, DependencyEdge } from '#feature-flags/types';

const graph = ref<DependencyGraph | null>(null);
const isLoading = ref(false);
const selectedNode = ref<string | null>(null);

const loadGraph = () => {
  isLoading.value = true;

  setTimeout(() => {
    const nodes: DependencyNode[] = [
      { id: '1', key: 'new-dashboard', type: 'flag', enabled: true, dependencies: [], dependents: ['premium-features'], level: 0 },
      { id: '2', key: 'premium-features', type: 'flag', enabled: false, dependencies: ['new-dashboard'], dependents: ['api-v2'], level: 1 },
      { id: '3', key: 'api-v2', type: 'flag', enabled: false, dependencies: ['premium-features'], dependents: [], level: 2 },
      { id: '4', key: 'dark-mode', type: 'flag', enabled: true, dependencies: [], dependents: [], level: 0 },
      { id: '5', key: 'checkout-flow', type: 'experiment', enabled: true, dependencies: ['new-dashboard'], dependents: [], level: 1 },
    ];

    const edges: DependencyEdge[] = [
      { id: 'e1', source: 'premium-features', target: 'new-dashboard', type: 'requires' },
      { id: 'e2', source: 'api-v2', target: 'premium-features', type: 'requires' },
      { id: 'e3', source: 'checkout-flow', target: 'new-dashboard', type: 'requires' },
    ];

    graph.value = {
      nodes,
      edges,
      cycles: [],
      orphans: ['dark-mode'],
    };

    isLoading.value = false;
  }, 400);
};

const getEdgeColor = (type: string) => {
  const colors: Record<string, string> = {
    requires: '#3b82f6',
    blocks: '#ef4444',
    enables: '#10b981',
  };
  return colors[type] || '#6b7280';
};

const getNodePosition = (node: DependencyNode, index: number, total: number) => {
  const levelNodes = graph.value?.nodes.filter((n) => n.level === node.level) || [];
  const posInLevel = levelNodes.findIndex((n) => n.id === node.id);
  const levelCount = levelNodes.length;

  const x = 100 + node.level * 200;
  const y = 50 + (posInLevel / Math.max(levelCount - 1, 1)) * 200;

  return { x, y };
};

const selectNode = (key: string) => {
  selectedNode.value = selectedNode.value === key ? null : key;
};

const selectedNodeData = computed(() => {
  if (!selectedNode.value || !graph.value) return null;
  return graph.value.nodes.find((n) => n.key === selectedNode.value);
});
</script>

<template>
  <div class="dg-container">
    <div class="dg-header">
      <h3>Dependency Graph</h3>
      <button
        class="dg-btn dg-btn-sm"
        :disabled="isLoading"
        @click="loadGraph"
      >
        {{ isLoading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="!graph" class="dg-empty">
      <button class="dg-btn dg-btn-primary" @click="loadGraph">
        Load Dependencies
      </button>
    </div>

    <template v-else>
      <div class="dg-summary">
        <div class="dg-stat">
          <span class="dg-stat-value">{{ graph.nodes.length }}</span>
          <span class="dg-stat-label">Flags</span>
        </div>
        <div class="dg-stat">
          <span class="dg-stat-value">{{ graph.edges.length }}</span>
          <span class="dg-stat-label">Dependencies</span>
        </div>
        <div v-if="graph.cycles.length > 0" class="dg-stat dg-warning">
          <span class="dg-stat-value">{{ graph.cycles.length }}</span>
          <span class="dg-stat-label">Cycles</span>
        </div>
        <div v-if="graph.orphans.length > 0" class="dg-stat dg-info">
          <span class="dg-stat-value">{{ graph.orphans.length }}</span>
          <span class="dg-stat-label">Orphans</span>
        </div>
      </div>

      <div class="dg-graph">
        <svg width="100%" height="300" class="dg-svg">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
          </defs>

          <g v-for="edge in graph.edges" :key="edge.id">
            <line
              :x1="getNodePosition(graph.nodes.find(n => n.key === edge.source)!, 0, 0).x + 60"
              :y1="getNodePosition(graph.nodes.find(n => n.key === edge.source)!, 0, 0).y + 20"
              :x2="getNodePosition(graph.nodes.find(n => n.key === edge.target)!, 0, 0).x + 60"
              :y2="getNodePosition(graph.nodes.find(n => n.key === edge.target)!, 0, 0).y + 20"
              :stroke="getEdgeColor(edge.type)"
              stroke-width="2"
              marker-end="url(#arrow)"
            />
          </g>

          <g
            v-for="(node, i) in graph.nodes"
            :key="node.id"
            @click="selectNode(node.key)"
          >
            <rect
              :x="getNodePosition(node, i, graph.nodes.length).x"
              :y="getNodePosition(node, i, graph.nodes.length).y"
              width="120"
              height="40"
              :rx="8"
              :class="['dg-node', { 'dg-selected': selectedNode === node.key, 'dg-enabled': node.enabled }]"
            />
            <text
              :x="getNodePosition(node, i, graph.nodes.length).x + 60"
              :y="getNodePosition(node, i, graph.nodes.length).y + 25"
              text-anchor="middle"
              class="dg-node-text"
            >
              {{ node.key }}
            </text>
          </g>
        </svg>
      </div>

      <div v-if="selectedNodeData" class="dg-details">
        <h4>{{ selectedNodeData.key }}</h4>
        <div class="dg-detail-row">
          <span>Status:</span>
          <span :class="selectedNodeData.enabled ? 'dg-enabled-text' : 'dg-disabled-text'">
            {{ selectedNodeData.enabled ? 'Enabled' : 'Disabled' }}
          </span>
        </div>
        <div v-if="selectedNodeData.dependencies.length > 0" class="dg-detail-row">
          <span>Depends on:</span>
          <span>{{ selectedNodeData.dependencies.join(', ') }}</span>
        </div>
        <div v-if="selectedNodeData.dependents.length > 0" class="dg-detail-row">
          <span>Dependents:</span>
          <span>{{ selectedNodeData.dependents.join(', ') }}</span>
        </div>
      </div>

      <div v-if="graph.cycles.length > 0" class="dg-issues">
        <h4>Circular Dependencies</h4>
        <div v-for="cycle in graph.cycles" :key="cycle.nodes.join('-')" class="dg-issue">
          {{ cycle.nodes.join(' → ') }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dg-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.dg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dg-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.dg-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.dg-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.dg-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.dg-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dg-empty {
  text-align: center;
  padding: 2rem;
}

.dg-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dg-stat {
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-align: center;
}

.dg-warning { background: #fef3c7; }
.dg-info { background: #dbeafe; }

.dg-stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
}

.dg-stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.dg-graph {
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.dg-svg {
  display: block;
}

.dg-node {
  fill: white;
  stroke: #d1d5db;
  stroke-width: 2;
  cursor: pointer;
}

.dg-node.dg-enabled {
  fill: #d1fae5;
  stroke: #10b981;
}

.dg-node.dg-selected {
  stroke: #3b82f6;
  stroke-width: 3;
}

.dg-node-text {
  font-size: 12px;
  fill: #374151;
  pointer-events: none;
}

.dg-details {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.dg-details h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.dg-detail-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.dg-detail-row span:first-child {
  color: #6b7280;
}

.dg-enabled-text { color: #10b981; }
.dg-disabled-text { color: #ef4444; }

.dg-issues {
  background: #fee2e2;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.dg-issues h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.dg-issue {
  font-size: 0.75rem;
  color: #991b1b;
}
</style>
