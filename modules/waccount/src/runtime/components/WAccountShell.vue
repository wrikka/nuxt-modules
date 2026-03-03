<script setup lang="ts">
import type { NavItem } from "../../../types";

interface Props {
	user: UserProfile | null;
	navItems: NavItem[];
	currentTab: string;
}

defineProps<Props>();

const emit = defineEmits<{
	(e: "navigate", item: NavItem): void;
	(e: "toggle-mobile-menu"): void;
}>();

const { toggleMobileMenu, closeMobileMenu } = useAuthDashboard();

const handleNavigate = (item: NavItem) => {
	emit("navigate", item);
	closeMobileMenu();
};

const handleToggleMobileMenu = () => {
	toggleMobileMenu();
	emit("toggle-mobile-menu");
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		<!-- Mobile Menu -->
		<AuthDashboardMobileMenu
			v-if="isMobileMenuOpen"
			:user="user"
			:nav-items="navItems"
			:current-tab="currentTab"
			@navigate="handleNavigate"
			@close="closeMobileMenu"
		/>

		<!-- Desktop Layout -->
		<div class="lg:grid lg:grid-cols-[280px_1fr]">
			<!-- Sidebar -->
			<aside class="hidden lg:block lg:h-screen lg:sticky lg:top-0">
				<AuthDashboardSidebar
					:user="user"
					:nav-items="navItems"
					:current-tab="currentTab"
					@navigate="handleNavigate"
				/>
			</aside>

			<!-- Main Content -->
			<main class="flex-1">
				<!-- Header -->
				<AuthDashboardAccountHeader
					:user="user"
					:nav-items="navItems"
					:current-tab="currentTab"
					@toggle-mobile-menu="handleToggleMobileMenu"
				/>

				<!-- Content Area with Slots -->
				<div class="p-4 sm:p-6 lg:p-8">
					<!-- Custom Tab Slot -->
					<slot name="custom-tab" />

					<!-- Default Content Slot -->
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>
