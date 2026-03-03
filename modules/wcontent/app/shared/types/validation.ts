export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

export interface ValidationWarning {
	field: string;
	message: string;
	code: string;
}

export interface ValidationRule {
	field: string;
	validate: (value: any) => boolean | Promise<boolean>;
	message: string;
	code: string;
	required?: boolean;
}

export interface ContentValidationOptions {
	checkMarkdown?: boolean;
	checkLinks?: boolean;
	checkImages?: boolean;
	checkCodeBlocks?: boolean;
	minLength?: number;
	maxLength?: number;
	allowedTags?: string[];
}
