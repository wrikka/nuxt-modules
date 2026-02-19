<template>
	<div class="stripe-customer-manager">
		<div class="manager-header">
			<h2 class="manager-title">{{ title }}</h2>
			<button class="btn-primary" @click="showCreateModal = true">Add Customer</button>
		</div>

		<div class="stats-grid">
			<div class="stat-card">
				<span class="stat-value">{{ stats.totalCustomers }}</span>
				<span class="stat-label">Total Customers</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ stats.activeSubscribers }}</span>
				<span class="stat-label">Subscribers</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ formatCurrency(stats.averageLifetimeValue) }}</span>
				<span class="stat-label">Avg LTV</span>
			</div>
			<div class="stat-card">
				<span class="stat-value">{{ stats.newCustomersThisMonth }}</span>
				<span class="stat-label">New This Month</span>
			</div>
		</div>

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

		<div class="customers-table">
			<div class="table-header">
				<span class="col-customer">Customer</span>
				<span class="col-email">Email</span>
				<span class="col-subscriptions">Subscriptions</span>
				<span class="col-spent">Total Spent</span>
				<span class="col-actions">Actions</span>
			</div>
			<div class="table-body">
				<div v-for="customer in filteredCustomers" :key="customer.id" class="table-row" @click="selectCustomer(customer)">
					<div class="col-customer">
						<div class="customer-avatar">{{ getInitials(customer.name || customer.email) }}</div>
						<div class="customer-info">
							<span class="customer-name">{{ customer.name || 'No name' }}</span>
							<span v-if="customer.delinquent" class="delinquent-badge">Delinquent</span>
						</div>
					</div>
					<div class="col-email">{{ customer.email }}</div>
					<div class="col-subscriptions">
						<span class="subscription-count">{{ customer.subscriptionCount }}</span>
					</div>
					<div class="col-spent">{{ formatCurrency(customer.totalSpent) }}</div>
					<div class="col-actions">
						<button class="btn-icon" @click.stop="editCustomer(customer)">✏️</button>
						<button class="btn-icon" @click.stop="viewCustomer(customer)">👁️</button>
					</div>
				</div>
			</div>
		</div>

		<div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
			<div class="modal-content">
				<h3 class="modal-title">{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h3>
				<div class="modal-form">
					<div class="form-field">
						<label class="field-label">Email *</label>
						<input v-model="customerForm.email" type="email" class="field-input" placeholder="customer@example.com" />
					</div>
					<div class="form-field">
						<label class="field-label">Name</label>
						<input v-model="customerForm.name" type="text" class="field-input" placeholder="John Doe" />
					</div>
					<div class="form-field">
						<label class="field-label">Phone</label>
						<input v-model="customerForm.phone" type="tel" class="field-input" placeholder="+1 555 123 4567" />
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Address Line 1</label>
							<input v-model="customerForm.address.line1" type="text" class="field-input" />
						</div>
						<div class="form-field">
							<label class="field-label">Address Line 2</label>
							<input v-model="customerForm.address.line2" type="text" class="field-input" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">City</label>
							<input v-model="customerForm.address.city" type="text" class="field-input" />
						</div>
						<div class="form-field">
							<label class="field-label">State</label>
							<input v-model="customerForm.address.state" type="text" class="field-input" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<label class="field-label">Postal Code</label>
							<input v-model="customerForm.address.postal_code" type="text" class="field-input" />
						</div>
						<div class="form-field">
							<label class="field-label">Country</label>
							<select v-model="customerForm.address.country" class="field-select">
								<option value="US">United States</option>
								<option value="GB">United Kingdom</option>
								<option value="CA">Canada</option>
								<option value="AU">Australia</option>
							</select>
						</div>
					</div>
				</div>
				<div class="modal-actions">
					<button class="btn-secondary" @click="closeModal">Cancel</button>
					<button class="btn-primary" @click="saveCustomer">{{ editingCustomer ? 'Update' : 'Create' }}</button>
				</div>
			</div>
		</div>

		<div v-if="selectedCustomer" class="detail-panel">
			<div class="detail-header">
				<h3 class="detail-title">Customer Details</h3>
				<button class="close-btn" @click="selectedCustomer = null">×</button>
			</div>
			<div class="detail-content">
				<div class="detail-section">
					<h4 class="section-title">Contact</h4>
					<div class="detail-row"><span class="label">Email:</span><span class="value">{{ selectedCustomer.email }}</span></div>
					<div class="detail-row"><span class="label">Name:</span><span class="value">{{ selectedCustomer.name || 'N/A' }}</span></div>
					<div class="detail-row"><span class="label">Phone:</span><span class="value">{{ selectedCustomer.phone || 'N/A' }}</span></div>
				</div>
				<div class="detail-section">
					<h4 class="section-title">Stats</h4>
					<div class="detail-row"><span class="label">Balance:</span><span class="value">{{ formatCurrency(selectedCustomer.balance) }}</span></div>
					<div class="detail-row"><span class="label">Total Spent:</span><span class="value">{{ formatCurrency(selectedCustomer.totalSpent) }}</span></div>
					<div class="detail-row"><span class="label">Subscriptions:</span><span class="value">{{ selectedCustomer.subscriptionCount }}</span></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { CustomerSummary, CustomerFormData, CustomerStats } from "#wpayment/types";

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

const showCreateModal = ref(false);
const editingCustomer = ref<CustomerSummary | null>(null);
const selectedCustomer = ref<CustomerSummary | null>(null);
const searchQuery = ref("");
const filterHasSubscription = ref("");
const sortBy = ref("created");

const customerForm = ref<CustomerFormData>({
	email: "",
	name: "",
	phone: "",
	address: {},
	shipping: {},
	taxExempt: "none",
	metadata: {},
});

const filteredCustomers = computed(() => {
	let result = props.customers;

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(
			(c) =>
				c.email.toLowerCase().includes(query) ||
				(c.name?.toLowerCase().includes(query))
		);
	}

	if (filterHasSubscription.value) {
		const hasSub = filterHasSubscription.value === "true";
		result = result.filter((c) => (c.subscriptionCount > 0) === hasSub);
	}

	return result;
});

const selectCustomer = (customer: CustomerSummary) => {
	selectedCustomer.value = customer;
	emit("view", customer.id);
};

const editCustomer = (customer: CustomerSummary) => {
	editingCustomer.value = customer;
	customerForm.value = {
		email: customer.email,
		name: customer.name || "",
		phone: customer.phone || "",
		address: {},
		shipping: {},
		taxExempt: "none",
		metadata: {},
	};
	showCreateModal.value = true;
};

const viewCustomer = (customer: CustomerSummary) => {
	selectCustomer(customer);
};

const saveCustomer = () => {
	if (editingCustomer.value) {
		emit("update", editingCustomer.value.id, customerForm.value);
	} else {
		emit("create", customerForm.value);
	}
	closeModal();
};

const closeModal = () => {
	showCreateModal.value = false;
	editingCustomer.value = null;
	customerForm.value = {
		email: "",
		name: "",
		phone: "",
		address: {},
		shipping: {},
		taxExempt: "none",
		metadata: {},
	};
};

const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount / 100);
};
</script>

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

.stats-grid {
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.stat-card {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 16px;
	text-align: center;
}

.stat-value {
	display: block;
	font-size: 24px;
	font-weight: 600;
	margin-bottom: 4px;
}

.stat-label {
	font-size: 12px;
	color: #666;
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

.customers-table {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
}

.table-header {
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 1fr 100px;
	padding: 12px 16px;
	background: #f9fafb;
	font-size: 12px;
	font-weight: 600;
	color: #666;
}

.table-body {
	max-height: 500px;
	overflow-y: auto;
}

.table-row {
	display: grid;
	grid-template-columns: 2fr 2fr 1fr 1fr 100px;
	padding: 12px 16px;
	border-top: 1px solid #f0f0f0;
	cursor: pointer;
	align-items: center;
}

.table-row:hover {
	background: #f9fafb;
}

.col-customer {
	display: flex;
	align-items: center;
	gap: 12px;
}

.customer-avatar {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #635bff;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	font-weight: 600;
}

.customer-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.customer-name {
	font-weight: 500;
}

.delinquent-badge {
	font-size: 10px;
	padding: 2px 6px;
	background: #fee2e2;
	color: #991b1b;
	border-radius: 4px;
}

.col-email {
	font-size: 14px;
	color: #666;
}

.col-subscriptions {
	text-align: center;
}

.subscription-count {
	display: inline-block;
	padding: 2px 8px;
	background: #e0e7ff;
	color: #3730a3;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
}

.col-spent {
	font-weight: 500;
}

.col-actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
}

.btn-icon {
	width: 28px;
	height: 28px;
	border: none;
	background: #f0f0f0;
	border-radius: 6px;
	cursor: pointer;
	font-size: 12px;
}

.btn-icon:hover {
	background: #e0e0e0;
}

.btn-primary,
.btn-secondary {
	padding: 12px 24px;
	border-radius: 6px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
}

.btn-primary {
	background: #635bff;
	color: white;
	border: none;
}

.btn-primary:hover {
	background: #4a4bd9;
}

.btn-secondary {
	background: white;
	color: #333;
	border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
	background: #f5f5f5;
}

.detail-panel {
	background: white;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 20px;
	position: sticky;
	top: 0;
	max-height: 600px;
	overflow-y: auto;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.detail-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0;
}

.close-btn {
	width: 32px;
	height: 32px;
	border: none;
	background: #f0f0f0;
	border-radius: 50%;
	font-size: 20px;
	cursor: pointer;
}

.detail-section {
	margin-bottom: 16px;
}

.section-title {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 8px 0;
	color: #666;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	padding: 6px 0;
	font-size: 14px;
}

.detail-row .label {
	color: #666;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal-content {
	background: white;
	border-radius: 8px;
	padding: 24px;
	width: 500px;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-title {
	font-size: 20px;
	font-weight: 600;
	margin: 0 0 16px 0;
}

.modal-form {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 16px;
}

.form-row {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
}

.form-field {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.field-label {
	font-size: 14px;
	font-weight: 500;
}

.field-input,
.field-select {
	padding: 10px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	font-size: 14px;
}

.modal-actions {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
}
</style>
