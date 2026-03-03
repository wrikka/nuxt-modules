export interface ExtractedInfo {
	emails: string[];
	hashtags: string[];
	mentions: string[];
	urls: string[];
	phoneNumbers: string[];
	numbers: string[];
	words: string[];
}

export function extractInfo(text: string): ExtractedInfo {
	const emails: string[] = [];
	const hashtags: string[] = [];
	const mentions: string[] = [];
	const urls: string[] = [];
	const phoneNumbers: string[] = [];
	const numbers: string[] = [];
	const words: string[] = [];

	// Simple regex for emails
	const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
	let match: RegExpExecArray | null;
	while ((match = emailRegex.exec(text)) !== null) {
		emails.push(match[0]);
	}

	// Hashtags
	const hashtagRegex = /#\w+/g;
	let hashtagMatch: RegExpExecArray | null;
	while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
		hashtags.push(hashtagMatch[0]);
	}

	// Mentions
	const mentionRegex = /@\w+/g;
	let mentionMatch: RegExpExecArray | null;
	while ((mentionMatch = mentionRegex.exec(text)) !== null) {
		mentions.push(mentionMatch[0]);
	}

	// URLs
	const urlRegex = /https?:\/\/[^\s]+/g;
	let urlMatch: RegExpExecArray | null;
	while ((urlMatch = urlRegex.exec(text)) !== null) {
		urls.push(urlMatch[0]);
	}

	// Phone numbers (simple)
	const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b|\(\d{3}\) \d{3}-\d{4}/g;
	let phoneMatch: RegExpExecArray | null;
	while ((phoneMatch = phoneRegex.exec(text)) !== null) {
		phoneNumbers.push(phoneMatch[0]);
	}

	// Numbers
	const numberRegex = /\b\d+(\.\d+)?\b/g;
	let numberMatch: RegExpExecArray | null;
	while ((numberMatch = numberRegex.exec(text)) !== null) {
		numbers.push(numberMatch[0]);
	}

	// Words
	const wordRegex = /\S+/g;
	let wordMatch: RegExpExecArray | null;
	while ((wordMatch = wordRegex.exec(text)) !== null) {
		words.push(wordMatch[0]);
	}

	return {
		emails,
		hashtags,
		mentions,
		urls,
		phoneNumbers,
		numbers,
		words,
	};
}

export function isMeaningful(text: string): boolean {
	// Trim whitespace
	const trimmed = text.trim();
	if (trimmed.length === 0) return false;

	// Check for repeated characters
	const repeatedRegex = /^(.)\1+$/;
	if (repeatedRegex.test(trimmed)) return false;

	// Check if contains at least one letter
	const hasLetter = /[a-zA-Z]/.test(trimmed);
	if (!hasLetter) return false;

	// Check for common test patterns (case insensitive)
	const commonTests = ["abc", "123", "test", "demo", "sample"];
	const lowerTrimmed = trimmed.toLowerCase();
	for (const test of commonTests) {
		if (lowerTrimmed === test) return false;
	}

	// If it has letters and is not just numbers/special chars/repeated/common tests, it's meaningful
	return true;
}
