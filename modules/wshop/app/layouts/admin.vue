<script setup lang="ts">
// This layout is used for the admin section of the site.
</script>

<template>

	<div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
		<!-- Navigation -->
		<nav 
			role="navigation" 
			aria-label="Main navigation"
			class="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50"
		>
			<div class="flex flex-wrap justify-between items-center max-w-7xl mx-auto">
				<div class="flex justify-start items-center">
					<NuxtLink 
						to="/" 
						class="flex items-center justify-between mr-4 group"
						aria-label="WShop Home"
					>
						<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white group-hover:text-primary-600 transition-colors">
							WShop
						</span>
					</NuxtLink>
				</div>
				
				<!-- Navigation actions -->
				<div class="flex items-center space-x-4">
					<ColorModeButton />
				</div>
			</div>
		</nav>

		<!-- Sidebar -->
		<Sidebar />

		<!-- Main content -->
		<main 
			aria-label="Main content"
			class="md:ml-64 h-auto pt-20 p-4"
		>
			<slot />
		</main>

		<!-- Toast notifications -->
		<Toaster 
			position="top-right"
			rich-colors
			close-button
		/>
	</div>

</template>

<style scoped>
/* Custom styling for the navigation bar */
nav {
	backdrop-filter: blur(8px);
	background-color: rgba(255, 255, 255, 0.95);
}

.dark nav {
	background-color: rgba(31, 41, 55, 0.95);
}
</style>
