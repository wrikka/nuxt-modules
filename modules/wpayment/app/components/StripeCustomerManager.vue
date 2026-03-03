<script setup lang="ts">
import type { CustomerSummary, CustomerFormData, CustomerStats } from "#wpayment/types";
import CustomerStatsComponent from "./customer/CustomerStats.vue";
import CustomerTable from "./customer/CustomerTable.vue";
import CustomerModal from "./customer/CustomerModal.vue";
import CustomerDetailPanel from "./customer/CustomerDetailPanel.vue";

interface Props {
	title?: string;
	customers?: CustomerSummary[];
	stats?: CustomerStats;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Customer Management",
	customers: () => [],
	stats: () => ({
		totalCustomers: 0,
		activeSubscribers: 0,
		delinquentCustomers: 0,
		averageLifetimeValue: 0,
		newCustomersThisMonth: 0,
		churnedCustomersThisMonth: 0,
	}),
});

const emit = defineEmits<{
	create: [data: CustomerFormData];
	update: [id: string, data: CustomerFormData];
	view: [id: string];
}>();

const showModal = ref(false);
const editingCustomer = ref<CustomerSummary | null>(null);
const selectedCustomer = ref<CustomerSummary | null>(null);
const searchQuery = ref("");
const filterHasSubscription = ref("");
const sortBy = ref("created");

const emptyForm: CustomerFormData = {
	email: "",
	name: "",
	phone: "",
	address: {},
	shipping: {},
	taxExempt: "none",
	metadata: {},
};

const filteredCustomers = computed(() => {
	let result = props.customers;
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(c => c.email.toLowerCase().includes(query) || (c.name?.toLowerCase().includes(query)));
	}
	if (filterHasSubscription.value) {
		const hasSub = filterHasSubscription.value === "true";
		result = result.filter(c => (c.subscriptionCount > 0) === hasSub);
	}
	return result;
});

const getFormData = (): CustomerFormData => {
	if (!editingCustomer.value) return emptyForm;
	return {
		email: editingCustomer.value.email,
		name: editingCustomer.value.name || "",
		phone: editingCustomer.value.phone || "",
		address: {},
		shipping: {},
		taxExempt: "none",
		metadata: {},
	};
};

const selectCustomer = (customer: CustomerSummary) => {
	selectedCustomer.value = customer;
	emit("view", customer.id);
};

const editCustomer = (customer: CustomerSummary) => {
	editingCustomer.value = customer;
	showModal.value = true;
};

const viewCustomer = (customer: CustomerSummary) => {
	selectCustomer(customer);
};

const saveCustomer = (data: CustomerFormData) => {
	if (editingCustomer.value) {
		emit("update", editingCustomer.value.id, data);
	} else {
		emit("create", data);
	}
	closeModal();
};

const closeModal = () => {
	showModal.value = false;
	editingCustomer.value = null;
};

const showCreateModal = () => {
	editingCustomer.value = null;
	showModal.value = true;
};
</script>

<template>
	<div class="stripe-customer-manager">
		<div class="manager-header">
			<h2 class="manager-title">{{ title }}</h2>
			<button class="btn-primary" @click="showCreateModal">Add Customer</button>
		</div>

		<CustomerStatsComponent :stats="stats" />

		<div class="filters-bar">
			<input v-model="searchQuery" type="text" class="search-input" placeholder="Search by name or email..." />
			<select v-model="filterHasSubscription" class="filter-select">
				<option value="">All Customers</option>
				<option value="true">With Subscription</option>
				<option value="false">No Subscription</option>
			</select>
			<select v-model="sortBy" class="filter-select">
				<option value="created">Newest</option>
				<option value="name">Name</option>
				<option value="totalSpent">Total Spent</option>
				<option value="lastPurchase">Last Purchase</option>
			</select>
		</div>

		<CustomerTable
			:customers="filteredCustomers"
			@select="selectCustomer"
			@edit="editCustomer"
			@view="viewCustomer"
		/>

		<CustomerModal
			v-if="showModal"
			:editing="!!editingCustomer"
			:initial-data="getFormData()"
			@save="saveCustomer"
			@cancel="closeModal"
		/>

		<CustomerDetailPanel
			v-if="selectedCustomer"
			:customer="selectedCustomer"
			@close="selectedCustomer = null"
		/>
	</div>
</template>

<style scoped>
.stripe-customer-manager {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	display: grid;
	grid-template-columns: 1fr 350px;
	gap: 24px;
}

.manager-header {
	grid-column: 1 / -1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.manager-title {
	font-size: 24px;
	font-weight: 600;
	margin: 0;
}

.filters-bar {
	grid-column: 1 / -1;
	display: flex;
	gap: 12px;
	margin-bottom: 24px;
}

.search-input {
	flex: 1;
	padding: 10px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.filter-select {
	padding: 10px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
	background: white;
}

.btn-primary {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	background: #635bff;
	color: white;
	border: none;
}

.btn-primary:hover {
	background: #4a4bd9;
}
</style>
