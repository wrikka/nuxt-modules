<script setup lang="ts">
import { computed } from "vue";
import type { ChartSeries } from "../types/chart";

interface Props {
	series: ChartSeries[];
	position?: "top" | "bottom" | "left" | "right";
	orientation?: "horizontal" | "vertical";
}

const props = withDefaults(defineProps<Props>(), {
	position: "bottom",
	orientation: "horizontal",
});

const orientationClasses = computed(() => {
	if (props.orientation === "horizontal") {
		return "flex flex-wrap justify-center gap-4";
	}
	return "flex flex-col gap-2";
});
</script>
