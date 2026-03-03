<script setup lang="ts">
interface Props {
	annotations?: Array<{
		id: string;
		type: "marker" | "line" | "area" | "text";
		position: { x: number; y: number };
		text?: string;
		color?: string;
		size?: number;
		style?: "solid" | "dashed" | "dotted";
	}>;
	width?: number;
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	annotations: () => [],
	width: 400,
	height: 300,
});
</script>

<template>
  <div class="absolute inset-0 pointer-events-none" :style="{ width: width + 'px', height: height + 'px' }">
    <svg
      class="absolute inset-0 w-full h-full"
      :viewBox="`0 0 ${width} ${height}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g v-for="annotation in annotations" :key="annotation.id">
        <!-- Marker -->
        <circle
          v-if="annotation.type === 'marker'"
          :cx="annotation.position.x"
          :cy="annotation.position.y"
          :r="annotation.size || 5"
          :fill="annotation.color || '#ff0000'"
          :stroke="annotation.color || '#ff0000'"
          stroke-width="2"
        />

        <!-- Line -->
        <line
          v-else-if="annotation.type === 'line'"
          x1="0"
          :y1="annotation.position.y"
          :x2="width"
          :y2="annotation.position.y"
          :stroke="annotation.color || '#000000'"
          :stroke-width="annotation.size || 2"
          :stroke-dasharray="annotation.style === 'dashed' ? '5,5' : annotation.style === 'dotted' ? '2,2' : 'none'"
        />

        <!-- Area -->
        <rect
          v-else-if="annotation.type === 'area'"
          :x="annotation.position.x"
          :y="annotation.position.y"
          :width="annotation.size || 50"
          :height="annotation.size || 50"
          :fill="annotation.color || '#ffff00'"
          fill-opacity="0.3"
          :stroke="annotation.color || '#ffff00'"
          stroke-width="1"
        />

        <!-- Text -->
        <text
          v-if="annotation.text"
          :x="annotation.position.x"
          :y="annotation.position.y"
          :fill="annotation.color || '#000000'"
          font-size="12"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ annotation.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
