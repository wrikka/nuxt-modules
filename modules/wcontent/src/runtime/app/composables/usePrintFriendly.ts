export function usePrintFriendly() {
	const printContent = () => {
		window.print();
	};

	return {
		printContent,
	};
}
