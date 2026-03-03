import type { NavItem } from "../../../types";
import type { UserProfile } from "../types";

/**
 * Main composable for WAccount
 * Provides authentication state and dashboard configuration
 */
export const useWAccount = () => {
	const config = useRuntimeConfig().public.waccount;

	// Auth state (will be populated by user's auth implementation)
	const user = useState<UserProfile | null>("waccount:user", () => null);
	const loading = useState<boolean>("waccount:loading", () => false);
	const isAuthenticated = computed(() => !!user.value);

	// Navigation state
	const currentTab = useState<string>("waccount:currentTab", () => "account");
	const isMobileMenuOpen = useState<boolean>("waccount:mobileMenu", () => false);

	// Navigation items
	const navItems = computed<NavItem[]>(() => {
		const defaultItems: NavItem[] = [
			{ id: "account", label: "Account", icon: "mdi:account-circle", path: "/account" },
			{ id: "profile", label: "Profile", icon: "mdi:account-edit", path: "/account/profile" },
			{ id: "security", label: "Security", icon: "mdi:shield-lock", path: "/account/security" },
			{ id: "notifications", label: "Notifications", icon: "mdi:bell", path: "/account/notifications" },
		];
		return [...defaultItems, ...(config.navItems || [])];
	});

	// Update current tab based on route
	const updateCurrentTab = () => {
		const route = useRoute();
		const matchedItem = navItems.value.find((item) => route.path.startsWith(item.path));
		if (matchedItem) {
			currentTab.value = matchedItem.id;
		}
	};

	// Watch route changes
	watch(() => useRoute().path, updateCurrentTab, { immediate: true });

	return {
		// Auth state
		user: readonly(user),
		loading: readonly(loading),
		isAuthenticated,

		// Navigation state
		currentTab: readonly(currentTab),
		isMobileMenuOpen,
		navItems,

		// Actions
		setUser: (newUser: UserProfile | null) => {
			user.value = newUser;
		},
		setLoading: (isLoading: boolean) => {
			loading.value = isLoading;
		},
		setCurrentTab: (tab: string) => {
			currentTab.value = tab;
		},
		toggleMobileMenu: () => {
			isMobileMenuOpen.value = !isMobileMenuOpen.value;
		},
		openMobileMenu: () => {
			isMobileMenuOpen.value = true;
		},
		closeMobileMenu: () => {
			isMobileMenuOpen.value = false;
		},
		signOut: async () => {
			user.value = null;
			await navigateTo("/");
		},
		refreshUser: async () => {
			// To be implemented by user's auth service
		},
	};
};
