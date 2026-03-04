import { ref, readonly } from "vue";

export function useChartTheme(initialTheme?: "light" | "dark") {
	const theme = ref<"light" | "dark">(initialTheme || "light");

	const toggleTheme = () => {
		theme.value = theme.value === "light" ? "dark" : "light";
	};

	const setTheme = (newTheme: "light" | "dark") => {
		theme.value = newTheme;
	};

	return {
		theme: readonly(theme),
		toggleTheme,
		setTheme,
	};
}
