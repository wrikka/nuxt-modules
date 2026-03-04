export function extractInfo(input: string): {
	words: string[];
	numbers: string[];
	emails: string[];
	urls: string[];
	phoneNumbers: string[];
	hashtags: string[];
	mentions: string[];
} {
	return {
		emails: input.match(/[\w.-]+@[\w.-]+\.\w+/g) || [],
		hashtags: input.match(/#\w+/g) || [],
		mentions: input.match(/@\w+/g) || [],
		numbers: input.match(/\d+/g) || [],
		phoneNumbers:
			input.match(
				/\+?\d{1,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}/g,
			) || [],
		urls: input.match(/https?:\/\/[^\s]+/g) || [],
		words: input
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0),
	};
}

export function isMeaningful(input: string): boolean {
	if (input.trim() === "") return false;

	// Check if it contains at least one letter
	if (!/[a-zA-Z]/.test(input)) return false;

	// Check if it's not just repeated characters
	if (/^(.)\1+$/.test(input)) return false;

	// Check if it's not just a pattern
	if (/^(?:abc|123|test|demo|sample)$/i.test(input)) return false;

	return true;
}













