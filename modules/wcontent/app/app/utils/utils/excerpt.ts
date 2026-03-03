export function extractExcerpt(content: string, maxLength = 150) {
	// Check for <!--more--> divider
	const moreDividerIndex = content.indexOf("<!--more-->");
	if (moreDividerIndex !== -1) {
		return content.slice(0, moreDividerIndex).trim();
	}

	// Extract first paragraph
	const firstParagraph = content.split("\n\n")[0];
	if (firstParagraph) {
		return firstParagraph.slice(0, maxLength).replace(/[#*`]/g, "") + "...";
	}

	// Fallback to first N characters
	return content.slice(0, maxLength).replace(/[#*`]/g, "") + "...";
}
