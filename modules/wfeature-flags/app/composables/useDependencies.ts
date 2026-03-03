import { computed, useState } from '#imports';
import type { DependencyCondition, DependencyGraph, DependencyResult, FlagDependency } from '#feature-flags/types';

export const useDependencies = () => {
  const dependencies = useState<Map<string, FlagDependency[]>>(
    'feature-flags-dependencies',
    () => new Map(),
  );

  const { flags, isEnabled } = useFeatureFlags();

  const addDependency = (
    flagKey: string,
    dependsOn: string,
    condition: DependencyCondition,
  ) => {
    const existing = dependencies.value.get(flagKey) ?? [];

    // Check for circular dependency
    if (hasCircularDependency(flagKey, dependsOn)) {
      throw new Error(`Circular dependency detected: ${flagKey} -> ${dependsOn}`);
    }

    const dependency: FlagDependency = {
      id: `dep_${Date.now()}`,
      flagKey,
      dependsOn,
      condition,
      createdAt: Date.now(),
    };

    existing.push(dependency);
    dependencies.value.set(flagKey, existing);

    return dependency;
  };

  const removeDependency = (flagKey: string, dependencyId: string) => {
    const existing = dependencies.value.get(flagKey);
    if (existing) {
      const filtered = existing.filter(d => d.id !== dependencyId);
      dependencies.value.set(flagKey, filtered);
    }
  };

  const getDependencies = (flagKey: string): FlagDependency[] => {
    return dependencies.value.get(flagKey) ?? [];
  };

  const checkDependency = (dependency: FlagDependency): boolean => {
    const dependentEnabled = isEnabled(dependency.dependsOn);

    switch (dependency.condition.type) {
      case 'enabled':
        return dependentEnabled === true;
      case 'disabled':
        return dependentEnabled === false;
      case 'equals':
        return dependentEnabled === dependency.condition.value;
      case 'not_equals':
        return dependentEnabled !== dependency.condition.value;
      default:
        return false;
    }
  };

  const checkDependencies = (flagKey: string): DependencyResult => {
    const deps = getDependencies(flagKey);
    const unsatisfiedDependencies: DependencyResult['unsatisfiedDependencies'] = [];

    for (const dep of deps) {
      if (!checkDependency(dep)) {
        unsatisfiedDependencies.push({
          flagKey: dep.flagKey,
          dependsOn: dep.dependsOn,
          reason: `Condition "${dep.condition.type}" not met`,
        });
      }
    }

    return {
      satisfied: unsatisfiedDependencies.length === 0,
      unsatisfiedDependencies,
    };
  };

  const isEnabledWithDependencies = (flagKey: string): boolean => {
    // Check if flag itself is enabled
    if (!isEnabled(flagKey)) {
      return false;
    }

    // Check all dependencies
    const result = checkDependencies(flagKey);
    return result.satisfied;
  };

  const hasCircularDependency = (flagKey: string, dependsOn: string): boolean => {
    // Check if dependsOn already depends on flagKey (directly or indirectly)
    const visited = new Set<string>();
    const stack = [dependsOn];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === flagKey) {
        return true;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const deps = dependencies.value.get(current) ?? [];
      for (const dep of deps) {
        stack.push(dep.dependsOn);
      }
    }

    return false;
  };

  const getDependencyGraph = computed<DependencyGraph>(() => {
    const nodes = Object.keys(flags.value).map(key => ({
      key,
      enabled: flags.value[key] ?? false,
    }));

    const edges: DependencyGraph['edges'] = [];

    for (const [flagKey, deps] of dependencies.value) {
      for (const dep of deps) {
        edges.push({
          from: flagKey,
          to: dep.dependsOn,
          condition: dep.condition,
        });
      }
    }

    return { nodes, edges };
  });

  const getDependents = (flagKey: string): string[] => {
    const dependents: string[] = [];

    for (const [key, deps] of dependencies.value) {
      if (deps.some(d => d.dependsOn === flagKey)) {
        dependents.push(key);
      }
    }

    return dependents;
  };

  const getTransitiveDependencies = (flagKey: string): string[] => {
    const visited = new Set<string>();
    const stack = [flagKey];
    const result: string[] = [];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const deps = dependencies.value.get(current) ?? [];
      for (const dep of deps) {
        if (!visited.has(dep.dependsOn)) {
          result.push(dep.dependsOn);
          stack.push(dep.dependsOn);
        }
      }
    }

    return result;
  };

  const clearDependencies = (flagKey: string) => {
    dependencies.value.delete(flagKey);
  };

  const clearAllDependencies = () => {
    dependencies.value.clear();
  };

  return {
    dependencies,
    addDependency,
    removeDependency,
    getDependencies,
    checkDependency,
    checkDependencies,
    isEnabledWithDependencies,
    hasCircularDependency,
    getDependencyGraph,
    getDependents,
    getTransitiveDependencies,
    clearDependencies,
    clearAllDependencies,
  };
};
