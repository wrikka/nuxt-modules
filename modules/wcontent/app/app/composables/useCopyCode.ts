import { ref } from "vue";

export function useCopyCode() {
	const copied = ref(false);
	const copyTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

	const copyCode = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code);
			copied.value = true;

			if (copyTimeout.value) {
				clearTimeout(copyTimeout.value);
			}

			copyTimeout.value = setTimeout(() => {
				copied.value = false;
			}, 2000);

			return true;
		} catch {
			return false;
		}
	};

	return {
		copied,
		copyCode,
	};
}
