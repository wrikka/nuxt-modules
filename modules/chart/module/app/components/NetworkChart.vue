<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { generateNetworkData, networkLayouts } from "../utils/network";
import type { ChartData } from "../types/chart";
import type { NetworkNode, NetworkLink } from "../utils/network";

interface Props {
	nodes?: NetworkNode[];
	links?: NetworkLink[];
	config?: {
		title?: string;
		layout?: "force" | "circular" | "random";
		nodeSize?: number;
		linkWidth?: number;
		width?: number;
		height?: number;
		interactive?: boolean;
	};
}

const props = withDefaults(defineProps<Props>(), {
	nodes: () => [],
	links: () => [],
	config: () => ({
		title: "Network Chart",
		layout: "force" as const,
		nodeSize: 10,
		linkWidth: 2,
		width: 400,
		height: 300,
		interactive: true,
	}),
});

const svgRef = ref<SVGElement>();
const hoveredNode = ref<string | null>(null);
const selectedNode = ref<string | null>(null);

const processedData = computed(() => {
	if (props.nodes.length > 0) {
		return generateNetworkData(props.nodes, props.links, props.config);
	}
	// Fallback to sample network
	const sampleNodes: NetworkNode[] = [
		{ id: "1", label: "Node A", x: 20, y: 30 },
		{ id: "2", label: "Node B", x: 80, y: 40 },
		{ id: "3", label: "Node C", x: 50, y: 80 },
		{ id: "4", label: "Node D", x: 30, y: 60 },
	];
	const sampleLinks: NetworkLink[] = [
		{ source: "1", target: "2" },
		{ source: "2", target: "3" },
		{ source: "3", target: "4" },
		{ source: "4", target: "1" },
	];
	return generateNetworkData(sampleNodes, sampleLinks, props.config);
});

const nodes = computed(() => processedData.value.series[0]?.data || []);
const links = computed(() => processedData.value.series[0]?.links || []);

const connectedNodes = computed(() => {
	if (!hoveredNode.value) return new Set();
	const connected = new Set<string>();
	links.value.forEach((link) => {
		if (link.source === hoveredNode.value) connected.add(link.target);
		if (link.target === hoveredNode.value) connected.add(link.source);
	});
	return connected;
});

const connectedLinks = computed(() => {
	if (!hoveredNode.value) return new Set();
	const connected = new Set<string>();
	links.value.forEach((link, index) => {
		if (
			link.source === hoveredNode.value ||
			link.target === hoveredNode.value
		) {
			connected.add(`${link.source}-${link.target}`);
		}
	});
	return connected;
});

onMounted(() => {
	if (props.config.layout === "force" && nodes.value.length > 0) {
		// Apply force layout
		const layoutedNodes = networkLayouts.force(
			nodes.value.map((n) => ({ ...n, id: n.label, x: n.x, y: n.y })),
			links.value,
			50,
		);
		// Update positions (in a real implementation, this would update the reactive data)
	}
});

const handleNodeHover = (nodeId: string, enter: boolean) => {
	if (props.config.interactive) {
		hoveredNode.value = enter ? nodeId : null;
	}
};

const handleNodeClick = (nodeId: string) => {
	if (props.config.interactive) {
		selectedNode.value = selectedNode.value === nodeId ? null : nodeId;
	}
};
</script>

<template>
  <div class="p-4 border border-gray-300 rounded-lg">
    <h3 v-if="processedData.title" class="mb-4 text-lg font-semibold">{{ processedData.title }}</h3>
    <div class="relative">
      <svg
        ref="svgRef"
        :width="config.width"
        :height="config.height"
        class="border border-gray-200 bg-white"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Links -->
        <g class="links">
          <line
            v-for="(link, index) in links"
            :key="`link-${index}`"
            :x1="nodes.find(n => n.label === link.source)?.x || 0"
            :y1="nodes.find(n => n.label === link.source)?.y || 0"
            :x2="nodes.find(n => n.label === link.target)?.x || 0"
            :y2="nodes.find(n => n.label === link.target)?.y || 0"
            :stroke="connectedLinks.has(`${link.source}-${link.target}`) ? '#ff6b6b' : (link.color || '#999')"
            :stroke-width="link.value || config.linkWidth"
            stroke-opacity="0.6"
            class="transition-all duration-200"
          />
        </g>

        <!-- Nodes -->
        <g class="nodes">
          <circle
            v-for="node in nodes"
            :key="`node-${node.label}`"
            :cx="node.x"
            :cy="node.y"
            :r="node.size || config.nodeSize"
            :fill="connectedNodes.has(node.label) ? '#ff6b6b' : (node.color || '#4a90e2')"
            :stroke="selectedNode === node.label ? '#333' : '#fff'"
            :stroke-width="selectedNode === node.label ? 3 : 2"
            class="cursor-pointer transition-all duration-200 hover:stroke-width-3"
            @mouseenter="handleNodeHover(node.label, true)"
            @mouseleave="handleNodeHover(node.label, false)"
            @click="handleNodeClick(node.label)"
          />
          <text
            v-for="node in nodes"
            :key="`label-${node.label}`"
            :x="node.x"
            :y="node.y - (node.size || config.nodeSize) - 3"
            text-anchor="middle"
            class="text-xs fill-gray-700 pointer-events-none"
            font-size="3"
          >
            {{ node.label }}
          </text>
        </g>
      </svg>

      <!-- Tooltip -->
      <div
        v-if="hoveredNode"
        class="absolute bg-black text-white px-2 py-1 rounded text-sm pointer-events-none z-10"
        :style="{
          left: `${nodes.find(n => n.label === hoveredNode)?.x || 0}%`,
          top: `${(nodes.find(n => n.label === hoveredNode)?.y || 0) - 10}%`,
          transform: 'translate(-50%, -100%)'
        }"
      >
        {{ hoveredNode }}
      </div>
    </div>
  </div>
</template>
