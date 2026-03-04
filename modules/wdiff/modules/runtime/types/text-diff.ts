export interface TextDiffLine {
	line: string;
	type: "added" | "removed" | "unchanged";
	lineNumber?: number;
}

export interface TextDiffOptions {
	ignoreWhitespace?: boolean;
	ignoreCase?: boolean;
	contextLines?: number;
}
