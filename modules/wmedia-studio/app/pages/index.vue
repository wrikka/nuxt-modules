<script setup lang="ts">
import { nanoid } from "nanoid";

const router = useRouter();

const createNewProject = async () => {
	const projectId = nanoid();
	router.push(`/editor/${projectId}`);
};

const createNewWebDesigner = async () => {
	const projectId = nanoid();
	router.push(`/designer/${projectId}`);
};

const createNewVideoProject = async () => {
	const projectId = nanoid();
	router.push(`/video-editor/${projectId}`);
};
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
		<div class="container mx-auto px-4 py-16">
			<div class="text-center mb-12">
				<h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
					Welcome to Media Studio
				</h1>
				<p class="text-xl text-gray-600 dark:text-gray-300">
					Create stunning designs with ease
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
				<NuxtLink
					to="/projects"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">📁</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						My Projects
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Access and manage your design projects
					</p>
				</NuxtLink>

				<NuxtLink
					to="/templates"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">🎨</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Templates
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Start with professionally designed templates
					</p>
				</NuxtLink>

				<NuxtLink
					to="/video-recording"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">🎥</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						Video Recording
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Record screen, camera, or both
					</p>
				</NuxtLink>

				<button
					@click="createNewVideoProject"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">🎬</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						New Video Project
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Create a new video from scratch
					</p>
				</button>

				<button
					@click="createNewProject"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">➕</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						New Design Project
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Create a new design from scratch
					</p>
				</button>

				<button
					@click="createNewWebDesigner"
					class="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
				>
					<div class="text-4xl mb-4">🧩</div>
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						New Web Designer
					</h2>
					<p class="text-gray-600 dark:text-gray-300">
						Framer-like page builder (MVP)
					</p>
				</button>
			</div>
		</div>
	</div>
</template>
