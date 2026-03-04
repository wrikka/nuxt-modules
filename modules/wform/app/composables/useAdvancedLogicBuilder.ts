import { computed, ref } from 'vue';
import type { FieldCondition, FormField, FormValues } from '../types';

export interface LogicNode {
  id: string;
  type: 'condition' | 'action' | 'start' | 'end';
  position: { x: number; y: number };
  data: {
    fieldId?: string;
    operator?: string;
    value?: unknown;
    action?: 'show' | 'hide' | 'require' | 'skip' | 'go_to';
    targetFieldId?: string;
    label?: string;
  };
}

export interface LogicConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: 'true' | 'false' | 'default';
}

export interface LogicFlow {
  nodes: LogicNode[];
  connections: LogicConnection[];
}

export function useAdvancedLogicBuilder() {
  const flow = ref<LogicFlow>({
    nodes: [],
    connections: [],
  });

  const selectedNodeId = ref<string | null>(null);
  const isDragging = ref(false);

  // ========== Node Management ==========
  const addNode = (type: LogicNode['type'], position: { x: number; y: number }, data?: Partial<LogicNode['data']>): LogicNode => {
    const node: LogicNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      data: data ?? {},
    };
    flow.value.nodes.push(node);
    return node;
  };

  const removeNode = (nodeId: string) => {
    const index = flow.value.nodes.findIndex(n => n.id === nodeId);
    if (index > -1) {
      flow.value.nodes.splice(index, 1);
      // Remove connections related to this node
      flow.value.connections = flow.value.connections.filter(
        c => c.source !== nodeId && c.target !== nodeId,
      );
    }
  };

  const updateNode = (nodeId: string, updates: Partial<LogicNode>) => {
    const node = flow.value.nodes.find(n => n.id === nodeId);
    if (node) {
      Object.assign(node, updates);
    }
  };

  const moveNode = (nodeId: string, position: { x: number; y: number }) => {
    const node = flow.value.nodes.find(n => n.id === nodeId);
    if (node) {
      node.position = position;
    }
  };

  // ========== Connection Management ==========
  const addConnection = (source: string, target: string, label?: string, condition?: LogicConnection['condition']): LogicConnection => {
    const connection: LogicConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      target,
      label,
      condition,
    };
    flow.value.connections.push(connection);
    return connection;
  };

  const removeConnection = (connectionId: string) => {
    const index = flow.value.connections.findIndex(c => c.id === connectionId);
    if (index > -1) {
      flow.value.connections.splice(index, 1);
    }
  };

  // ========== Flow Evaluation ==========
  const evaluateFlow = (values: FormValues, fields: FormField[]): Map<string, { action: string; targetFieldId: string }[]> => {
    const results = new Map<string, { action: string; targetFieldId: string }[]>();

    // Start from start node
    const startNode = flow.value.nodes.find(n => n.type === 'start');
    if (!startNode) return results;

    // Traverse the flow
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: startNode.id, path: [] }];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;

      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const node = flow.value.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      // Get outgoing connections
      const outgoing = flow.value.connections.filter(c => c.source === nodeId);

      for (const conn of outgoing) {
        const targetNode = flow.value.nodes.find(n => n.id === conn.target);
        if (!targetNode) continue;

        let shouldTraverse = true;

        // Evaluate condition nodes
        if (node.type === 'condition' && node.data.fieldId) {
          const fieldValue = values[node.data.fieldId];
          const conditionMet = evaluateCondition(
            fieldValue,
            node.data.operator ?? 'eq',
            node.data.value,
          );

          shouldTraverse = conn.condition === 'true' ? conditionMet : !conditionMet;
        }

        if (shouldTraverse) {
          // If action node, record the action
          if (targetNode.type === 'action' && targetNode.data.action && targetNode.data.targetFieldId) {
            const fieldId = targetNode.data.targetFieldId;
            const actions = results.get(fieldId) ?? [];
            actions.push({
              action: targetNode.data.action,
              targetFieldId,
            });
            results.set(fieldId, actions);
          }

          queue.push({ nodeId: conn.target, path: [...path, nodeId] });
        }
      }
    }

    return results;
  };

  // ========== Condition Evaluation ==========
  const evaluateCondition = (fieldValue: unknown, operator: string, compareValue: unknown): boolean => {
    switch (operator) {
      case 'eq':
      case 'equals':
        return fieldValue === compareValue;
      case 'neq':
      case 'not_equals':
        return fieldValue !== compareValue;
      case 'gt':
      case 'greater_than':
        return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue > compareValue;
      case 'gte':
      case 'greater_than_or_equal':
        return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue >= compareValue;
      case 'lt':
      case 'less_than':
        return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue < compareValue;
      case 'lte':
      case 'less_than_or_equal':
        return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue <= compareValue;
      case 'contains':
        return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.includes(compareValue);
      case 'starts_with':
        return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.startsWith(compareValue);
      case 'ends_with':
        return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.endsWith(compareValue);
      case 'in':
        return Array.isArray(compareValue) && compareValue.includes(fieldValue);
      case 'not_in':
        return Array.isArray(compareValue) && !compareValue.includes(fieldValue);
      case 'empty':
        return fieldValue === undefined || fieldValue === null || fieldValue === '' ||
          (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'not_empty':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' &&
          (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return false;
    }
  };

  // ========== Preset Flows ==========
  const createShowHideFlow = (fieldId: string, conditionFieldId: string, operator: string, value: unknown): LogicFlow => {
    const start = addNode('start', { x: 50, y: 200 });
    const condition = addNode('condition', { x: 250, y: 200 }, {
      fieldId: conditionFieldId,
      operator,
      value,
      label: `If ${conditionFieldId} ${operator} ${value}`,
    });
    const showAction = addNode('action', { x: 450, y: 100 }, {
      action: 'show',
      targetFieldId: fieldId,
      label: `Show ${fieldId}`,
    });
    const hideAction = addNode('action', { x: 450, y: 300 }, {
      action: 'hide',
      targetFieldId: fieldId,
      label: `Hide ${fieldId}`,
    });
    const end = addNode('end', { x: 650, y: 200 });

    addConnection(start.id, condition.id);
    addConnection(condition.id, showAction.id, 'Yes', 'true');
    addConnection(condition.id, hideAction.id, 'No', 'false');
    addConnection(showAction.id, end.id);
    addConnection(hideAction.id, end.id);

    return { nodes: flow.value.nodes, connections: flow.value.connections };
  };

  const createSkipToFlow = (fromFieldId: string, toFieldId: string, conditionFieldId: string, operator: string, value: unknown): LogicFlow => {
    const start = addNode('start', { x: 50, y: 200 });
    const condition = addNode('condition', { x: 250, y: 200 }, {
      fieldId: conditionFieldId,
      operator,
      value,
      label: `If ${conditionFieldId} ${operator} ${value}`,
    });
    const skipAction = addNode('action', { x: 450, y: 100 }, {
      action: 'go_to',
      targetFieldId: toFieldId,
      label: `Skip to ${toFieldId}`,
    });
    const continueAction = addNode('action', { x: 450, y: 300 }, {
      action: 'go_to',
      targetFieldId: fromFieldId,
      label: `Continue to ${fromFieldId}`,
    });
    const end = addNode('end', { x: 650, y: 200 });

    addConnection(start.id, condition.id);
    addConnection(condition.id, skipAction.id, 'Yes', 'true');
    addConnection(condition.id, continueAction.id, 'No', 'false');
    addConnection(skipAction.id, end.id);
    addConnection(continueAction.id, end.id);

    return { nodes: flow.value.nodes, connections: flow.value.connections };
  };

  // ========== Import/Export ==========
  const exportFlow = (): string => {
    return JSON.stringify(flow.value, null, 2);
  };

  const importFlow = (json: string) => {
    try {
      const imported = JSON.parse(json) as LogicFlow;
      flow.value = imported;
      return true;
    } catch {
      return false;
    }
  };

  // ========== Validation ==========
  const validateFlow = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check for start node
    const hasStart = flow.value.nodes.some(n => n.type === 'start');
    if (!hasStart) {
      errors.push('Flow must have a start node');
    }

    // Check for end node
    const hasEnd = flow.value.nodes.some(n => n.type === 'end');
    if (!hasEnd) {
      errors.push('Flow must have an end node');
    }

    // Check for orphaned nodes
    flow.value.nodes.forEach(node => {
      if (node.type === 'start') return;

      const hasIncoming = flow.value.connections.some(c => c.target === node.id);
      if (!hasIncoming) {
        errors.push(`Node "${node.data.label ?? node.id}" has no incoming connection`);
      }
    });

    // Check for disconnected end nodes
    flow.value.nodes.forEach(node => {
      if (node.type === 'end') return;

      const hasOutgoing = flow.value.connections.some(c => c.source === node.id);
      if (!hasOutgoing && node.type !== 'end') {
        errors.push(`Node "${node.data.label ?? node.id}" has no outgoing connection`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // ========== Computed ==========
  const nodesByType = computed(() => {
    const grouped = new Map<LogicNode['type'], LogicNode[]>();
    flow.value.nodes.forEach(node => {
      const list = grouped.get(node.type) ?? [];
      list.push(node);
      grouped.set(node.type, list);
    });
    return grouped;
  });

  const selectedNode = computed(() =>
    flow.value.nodes.find(n => n.id === selectedNodeId.value) ?? null,
  );

  return {
    flow,
    selectedNodeId,
    selectedNode,
    isDragging,
    nodesByType,
    addNode,
    removeNode,
    updateNode,
    moveNode,
    addConnection,
    removeConnection,
    evaluateFlow,
    evaluateCondition,
    createShowHideFlow,
    createSkipToFlow,
    exportFlow,
    importFlow,
    validateFlow,
  };
}
