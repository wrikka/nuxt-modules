<template>
	<div class="p-4">
		<h1 class="text-2xl font-bold mb-4">WDesign Playground</h1>
		<Button variant="default">Default Button</Button>
		<Button variant="secondary" class="ml-2">Secondary Button</Button>
		<div class="mt-4">
			<Input placeholder="Type here" class="w-64" />
		</div>
		<Card class="mt-4 w-96">
			<CardHeader>
				<h3 class="text-lg font-semibold">Card Title</h3>
			</CardHeader>
			<CardContent>
				<p>This is a card content.</p>
			</CardContent>
			<CardFooter>
				<Button size="sm">Action</Button>
			</CardFooter>
		</Card>
	</div>
</template>

<script setup lang="ts">
// Components are auto-imported from wdesign module
</script>
