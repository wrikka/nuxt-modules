<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const projectId = route.params.id as string;

const loading = ref(false);

const handleInvite = async (email: string, role: string) => {
	loading.value = true;
	try {
		await $fetch(`/api/projects/${projectId}/share`, {
			method: "POST",
			body: { email, role },
		});
	} catch (err) {
		console.error("Failed to invite member:", err);
		alert("Failed to invite member. Please try again.");
	} finally {
		loading.value = false;
	}
};

const handleUpdateRole = async (memberId: string, role: string) => {
	try {
		await $fetch(`/api/projects/${projectId}/share/${memberId}`, {
			method: "PUT",
			body: { role },
		});
	} catch (err) {
		console.error("Failed to update role:", err);
	}
};

const handleRemove = async (memberId: string) => {
	try {
		await $fetch(`/api/projects/${projectId}/share/${memberId}`, {
			method: "DELETE",
		});
	} catch (err) {
		console.error("Failed to remove member:", err);
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="mb-8">
				<NuxtLink
					:to="`/projects/${projectId}`"
					class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
				>
					<i class="i-mdi-arrow-left mr-1" />
					Back to Project
				</NuxtLink>
				<h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
					Share Project
				</h1>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<ProjectShare
					:project-id="projectId"
					:loading="loading"
					@invite="handleInvite"
					@update-role="handleUpdateRole"
					@remove="handleRemove"
				/>
			</div>
		</div>
	</div>
</template>
