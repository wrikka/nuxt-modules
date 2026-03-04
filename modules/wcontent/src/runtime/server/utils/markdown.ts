import { parseMarkdown, tokensToHtml, type Token } from "@wrikka/wmarkdown/runtime/utils/parser";
import { highlightCode } from "@wrikka/wmarkdown/runtime/utils/shiki";

interface MarkdownOptions {
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
  highlight?: boolean;
  mdc?: boolean; // Markdown Components support
  theme?: string;
}

export async function processMarkdown(
  content: string,
  options: MarkdownOptions = {},
): Promise<string> {
  const {
    highlight = true,
    mdc = true,
    typographer = true,
    theme = "github-dark",
  } = options;

  // Process MDC (Markdown Components) syntax before parsing
  if (mdc) {
    content = processMdc(content);
  }

  // Process typography enhancements
  if (typographer) {
    content = processTypography(content);
  }

  // Parse markdown using wmarkdown
  const tokens = parseMarkdown(content);

  // Convert tokens to HTML with optional highlighting
  const html = highlight
    ? await tokensToHtml(tokens, {
        highlight: async (code, lang) => {
          if (!lang) return code;
          return await highlightCode(code, lang, theme);
        },
      })
    : tokensToHtml(tokens);

  return html;
}

function processMdc(content: string): string {
  // Convert MDC syntax like ::component{prop="value"} to Vue component tags
  // This is a simplified implementation
  
  // Convert ::component{...} to <component ... />
  content = content.replace(
    /::(\w+)\{([^}]*)\}/g,
    (match, componentName, props) => {
      const parsedProps = parseMdcProps(props);
      return `<${componentName}${parsedProps} />`;
    }
  );

  // Convert ::component{...}\n...\n:: to <component ...>...</component>
  content = content.replace(
    /::(\w+)\{([^}]*)\}([\s\S]*?)::/g,
    (match, componentName, props, innerContent) => {
      const parsedProps = parseMdcProps(props);
      return `<${componentName}${parsedProps}>${innerContent.trim()}</${componentName}>`;
    }
  );

  return content;
}

function parseMdcProps(props: string): string {
  const attrs: string[] = [];
  
  // Parse key="value" or key={value} or :key="value"
  const regex = /(?::)?(\w+)(?:=\{([^}]+)\}|="([^"]+)"|='([^']+)'|=(\S+))?/g;
  let match;
  
  while ((match = regex.exec(props)) !== null) {
    const [, key, exprValue, strValue1, strValue2, bareValue] = match;
    const value = exprValue || strValue1 || strValue2 || bareValue;
    
    if (value) {
      attrs.push(` ${key}="${value}"`);
    } else {
      attrs.push(` ${key}`);
    }
  }
  
  return attrs.join("");
}

function processTypography(content: string): string {
  // Smart quotes
  content = content.replace(/"([^"]*)"/g, '"$1"');
  content = content.replace(/'([^']*)'/g, ''$1'');

  // Ellipsis
  content = content.replace(/\.\.\./g, "…");

  // Em-dash
  content = content.replace(/--/g, "—");

  // En-dash for ranges
  content = content.replace(/(\d+)-(\d+)/g, "$1–$2");

  return content;
}

export function extractToc(content: string): TocItem[] {
  const tokens = parseMarkdown(content);
  const toc: TocItem[] = [];

  // Extract headings from tokens
  function extractHeadings(tokens: Token[]) {
    for (const token of tokens) {
      if (token.type === "heading") {
        const level = (token.props?.level as number) || 1;
        const text = token.content;
        const id = slugify(text);

        toc.push({
          level,
          text,
          id,
          children: [],
        });
      }

      if (token.children) {
        extractHeadings(token.children);
      }
    }
  }

  extractHeadings(tokens);
  return buildTocTree(toc);
}

function buildTocTree(items: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of items) {
    const newItem: TocItem = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(newItem);
    } else {
      stack[stack.length - 1].children.push(newItem);
    }

    stack.push(newItem);
  }

  return root;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface TocItem {
  level: number;
  text: string;
  id: string;
  children: TocItem[];
}
