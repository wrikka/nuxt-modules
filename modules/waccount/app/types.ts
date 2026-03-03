export interface ModuleOptions {
	/**
	 * Public pages that don't require authentication
	 * @default []
	 */
	publicPages?: string[];

	/**
	 * Custom navigation items
	 */
	navItems?: NavItem[];

	/**
	 * Enable/disable auth middleware
	 * @default true
	 */
	enableAuthMiddleware?: boolean;

	/**
	 * Login page path
	 * @default '/auth/login'
	 */
	loginPath?: string;

	/**
	 * WorkOS Client ID
	 */
	workosClientId?: string;

	/**
	 * WorkOS API Key
	 */
	workosApiKey?: string;

	/**
	 * Database URL
	 */
	databaseUrl?: string;
}

export interface NavItem {
	id: string;
	label: string;
	icon?: string;
	path: string;
	badge?: string | number;
	disabled?: boolean;
}

export interface WAccountConfig {
	publicPages: string[];
	navItems: NavItem[];
	enableAuthMiddleware: boolean;
	loginPath: string;
	workosClientId: string;
}

export interface WAccountRuntimeConfig {
	workosApiKey: string;
	databaseUrl: string;
}
