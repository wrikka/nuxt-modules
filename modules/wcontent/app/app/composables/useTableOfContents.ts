import { onMounted, onUnmounted, ref } from "vue";

export function useTableOfContents() {
	const headings = ref<Array<{ id: string; text: string; level: number }>>([]);
	const activeHeading = ref<string>("");

	const generateTableOfContents = () => {
		const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		const toc: Array<{ id: string; text: string; level: number }> = [];

		elements.forEach((element, index) => {
			const id = `heading-${index}`;
			element.id = id;
			toc.push({
				id,
				text: element.textContent || "",
				level: parseInt(element.tagName.replace("H", "")),
			});
		});

		headings.value = toc;
	};

	const scrollToHeading = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
			activeHeading.value = id;
		}
	};

	const updateActiveHeading = () => {
		const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		let current = "";

		for (let i = elements.length - 1; i >= 0; i--) {
			const element = elements[i] as HTMLElement;
			const rect = element.getBoundingClientRect();
			if (rect.top <= 100) {
				current = element.id;
				break;
			}
		}

		if (current) {
			activeHeading.value = current;
		}
	};

	onMounted(() => {
		generateTableOfContents();
		window.addEventListener("scroll", updateActiveHeading);
	});

	onUnmounted(() => {
		window.removeEventListener("scroll", updateActiveHeading);
	});

	return {
		headings,
		activeHeading,
		generateTableOfContents,
		scrollToHeading,
	};
}
