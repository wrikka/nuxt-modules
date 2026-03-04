import { parseMarkdown, type Token } from "@wrikka/wmarkdown/runtime/utils/parser";

export interface MDCNode {
	type: "element" | "text" | "component";
	tag?: string;
	props?: Record<string, any>;
	children?: MDCNode[];
	content?: string;
}

export function parseMDC(markdown: string): MDCNode[] {
	// Parse markdown to tokens using wmarkdown
	const tokens = parseMarkdown(markdown);
	const nodes: MDCNode[] = [];

	for (const token of tokens) {
		if (token.type === "paragraph") {
			nodes.push({
				type: "element",
				tag: "p",
				children: parseInline(token.content || ""),
			});
		} else if (token.type === "heading") {
			const level = (token.props?.level as number) || 1;
			nodes.push({
				type: "element",
				tag: `h${level}`,
				children: parseInline(token.content || ""),
			});
		} else if (token.type === "codeblock") {
			nodes.push({
				type: "element",
				tag: "pre",
				children: [{
					type: "element",
					tag: "code",
					props: { class: `language-${(token.props?.lang as string) || "text"}` },
					children: [{
						type: "text",
						content: token.content || "",
					}],
				}],
			});
		} else if (token.type === "list") {
			const isOrdered = token.props?.ordered as boolean;
			const items = token.children || [];
			nodes.push({
				type: "element",
				tag: isOrdered ? "ol" : "ul",
				children: items.map((item: Token) => ({
					type: "element" as const,
					tag: "li",
					children: parseInline(item.content || ""),
				})),
			});
		} else if (token.type === "blockquote") {
			nodes.push({
				type: "element",
				tag: "blockquote",
				children: parseInline(token.content || ""),
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
