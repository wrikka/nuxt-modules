import { marked } from "marked";

export interface MDCNode {
	type: "element" | "text" | "component";
	tag?: string;
	props?: Record<string, any>;
	children?: MDCNode[];
	content?: string;
}

export function parseMDC(markdown: string): MDCNode[] {
	// Parse markdown to tokens
	const tokens = marked.lexer(markdown);
	const nodes: MDCNode[] = [];

	for (const token of tokens) {
		if (token.type === "paragraph") {
			nodes.push({
				type: "element",
				tag: "p",
				children: parseInline(token.text || ""),
			});
		} else if (token.type === "heading") {
			nodes.push({
				type: "element",
				tag: `h${token.depth}`,
				children: parseInline(token.text || ""),
			});
		} else if (token.type === "code") {
			nodes.push({
				type: "element",
				tag: "pre",
				children: [{
					type: "element",
					tag: "code",
					props: { class: `language-${token.lang || "text"}` },
					children: [{
						type: "text",
						content: token.text || "",
					}],
				}],
			});
		} else if (token.type === "list") {
			nodes.push({
				type: "element",
				tag: token.ordered ? "ol" : "ul",
				children: (token.items || []).map((item: any) => ({
					type: "element",
					tag: "li",
					children: parseInline(item.text || ""),
				})),
			});
		} else if (token.type === "blockquote") {
			nodes.push({
				type: "element",
				tag: "blockquote",
				children: parseInline(token.text || ""),
			});
		}
	}

	return nodes;
}

function parseInline(text: string): MDCNode[] {
	const nodes: MDCNode[] = [];
	let remaining = text;

	// Parse components: <ComponentName prop="value">content</ComponentName>
	const componentRegex = /<([A-Z][a-zA-Z0-9]*)(\s+[^>]*)?>(.*?)<\/\1>/gs;
	let match;

	while ((match = componentRegex.exec(remaining)) !== null) {
		const [fullMatch, componentName, props, content] = match;
		const before = remaining.slice(0, match.index);

		if (before) {
			nodes.push(...parseTextWithFormatting(before));
		}

		// Parse props
		const parsedProps: Record<string, any> = {};
		if (props) {
			const propRegex = /(\w+)="([^"]*)"/g;
			let propMatch;
			while ((propMatch = propRegex.exec(props)) !== null) {
				parsedProps[propMatch[1]] = propMatch[2];
			}
		}

		nodes.push({
			type: "component",
			tag: componentName,
			props: parsedProps,
			children: parseInline(content),
		});

		remaining = remaining.slice(match.index + fullMatch.length);
		componentRegex.lastIndex = 0;
	}

	if (remaining) {
		nodes.push(...parseTextWithFormatting(remaining));
	}

	return nodes;
}

function parseTextWithFormatting(text: string): MDCNode[] {
	const nodes: MDCNode[] = [];
	let remaining = text;

	// Parse bold: **text**
	const boldRegex = /\*\*([^*]+)\*\*/g;
	let match;

	while ((match = boldRegex.exec(remaining)) !== null) {
		const [fullMatch, content] = match;
		const before = remaining.slice(0, match.index);

		if (before) {
			nodes.push({ type: "text", content: before });
		}

		nodes.push({
			type: "element",
			tag: "strong",
			children: [{ type: "text", content }],
		});

		remaining = remaining.slice(match.index + fullMatch.length);
		boldRegex.lastIndex = 0;
	}

	if (remaining) {
		nodes.push({ type: "text", content: remaining });
	}

	return nodes;
}

export function renderMDC(nodes: MDCNode[]): string {
	return nodes.map(node => {
		if (node.type === "text") {
			return node.content || "";
		}

		if (node.type === "element") {
			const children = node.children ? renderMDC(node.children) : "";
			const props = node.props ? Object.entries(node.props).map(([k, v]) => ` ${k}="${v}"`).join("") : "";
			return `<${node.tag}${props}>${children}</${node.tag}>`;
		}

		if (node.type === "component") {
			const children = node.children ? renderMDC(node.children) : "";
			const props = node.props ? Object.entries(node.props).map(([k, v]) => ` ${k}="${v}"`).join("") : "";
			return `<${node.tag}${props}>${children}</${node.tag}>`;
		}

		return "";
	}).join("");
}
