<template>
  <div class="algorithm-demo">
    <div class="demo-header">
      <h3>{{ title }}</h3>
      <button @click="runAlgorithm" :disabled="isRunning" class="run-btn">
        {{ isRunning ? 'Running...' : 'Run Algorithm' }}
      </button>
    </div>

    <div class="demo-content">
      <div class="graph-section">
        <GraphVisualizer
          :nodes="nodes"
          :edges="edges"
          :width="500"
          :height="400"
          layout="circular"
          @node-click="onNodeClick"
        />
      </div>

      <div class="controls-section">
        <div class="control-group">
          <label>Start Node:</label>
          <select v-model="startNode" @change="resetVisualization">
            <option v-for="node in nodes" :key="node.id" :value="node.id">
              {{ node.label || node.id }}
            </option>
          </select>
        </div>

        <div class="control-group" v-if="showEndNode">
          <label>End Node:</label>
          <select v-model="endNode" @change="resetVisualization">
            <option v-for="node in nodes" :key="node.id" :value="node.id">
              {{ node.label || node.id }}
            </option>
          </select>
        </div>

        <div class="results" v-if="results">
          <h4>Results:</h4>
          <pre>{{ JSON.stringify(results, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <div class="explanation" v-if="explanation">
      <h4>How it works:</h4>
      <p>{{ explanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlgorithmDemo } from '../composables/useAlgorithmDemo'
import GraphVisualizer from './GraphVisualizer.vue'

interface Node {
  id: string | number
  label?: string
  color?: string
  data?: any
}

interface Edge {
  from: string | number
  to: string | number
  weight?: number
  highlighted?: boolean
}

interface Props {
  title: string
  algorithm: 'dijkstra' | 'astar' | 'bfs' | 'dfs'
  nodes: Node[]
  edges: Edge[]
  explanation?: string
}

const props = withDefaults(defineProps<Props>(), {
  explanation: ''
})

const {
  startNode,
  endNode,
  selectedNode,
  showEndNode,
  isRunning,
  results,
  resetVisualization,
  runDemoAlgorithm,
  selectNode,
  onNodeClick
} = useAlgorithmDemo(props)
</script>

<style scoped>
.algorithm-demo {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: #fafafa;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.demo-header h3 {
  margin: 0;
  color: #333;
}

.run-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.run-btn:hover:not(:disabled) {
  background: #0056b3;
}

.run-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.demo-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.graph-section {
  flex: 1;
}

.controls-section {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: bold;
  color: #555;
}

.control-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.results {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.results h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.results pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
}

.explanation {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.explanation h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.explanation p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .demo-content {
    flex-direction: column;
  }

  .controls-section {
    width: 100%;
  }
}
</style>
