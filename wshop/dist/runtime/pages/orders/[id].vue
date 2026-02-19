<script setup>
const route = useRoute();
</script>

<template>
	<div>
		<h1>Order Details for ID: {{ $route.params.id }}</h1>
		<!-- Order details will go here -->
	</div>
</template>
