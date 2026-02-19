<script setup>
const route = useRoute();
</script>

<template>
	<div>
		<h1>Customer Details for ID: {{ $route.params.id }}</h1>
		<!-- Customer details will go here -->
	</div>
</template>
