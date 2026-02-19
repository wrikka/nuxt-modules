<template>
	<div class="p-8 max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-6">Stripe Module Example</h1>

		<div class="grid gap-4">
			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Stripe Status</h2>
				<p>Initialized: {{ isInitialized }}</p>
				<p>Loading: {{ loading }}</p>
				<p v-if="error" class="text-red-500">Error: {{ error }}</p>
			</div>

			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Initialize Stripe</h2>
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded"
					:disabled="loading"
					@click="initStripe"
				>
					{{ loading ? "Loading..." : "Initialize Stripe" }}
				</button>
			</div>

			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Payment Elements</h2>
				<button
					class="px-4 py-2 bg-green-500 text-white rounded mr-2"
					:disabled="!isInitialized"
					@click="createElements"
				>
					Create Elements
				</button>
				<p v-if="elementsCreated" class="text-green-600 mt-2">
					Elements created successfully
				</p>
			</div>

			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Test Payment</h2>
				<input
					v-model="clientSecret"
					type="text"
					placeholder="Enter client secret"
					class="w-full p-2 border rounded mb-2"
				/>
				<button
					class="px-4 py-2 bg-purple-500 text-white rounded"
					:disabled="!isInitialized || !clientSecret"
					@click="confirmPayment"
				>
					Confirm Payment
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const {
	stripe,
	loading,
	error,
	initialize,
	createElements: createStripeElements,
	confirmPayment: confirm,
} = useStripe()

const clientSecret = ref("")
const elementsCreated = ref(false)

const isInitialized = computed(() => !!stripe.value)

const initStripe = async () => {
	await initialize()
}

const createElements = async () => {
	createStripeElements()
	elementsCreated.value = true
}

const confirmPayment = async () => {
	if (!clientSecret.value) return

	const result = await confirm(clientSecret.value)
	if (result.error) {
		console.error("Payment failed:", result.error.message)
	} else {
		console.log("Payment succeeded:", result.paymentIntent)
	}
}
</script>
