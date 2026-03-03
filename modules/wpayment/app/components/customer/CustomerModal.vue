<script setup lang="ts">
import type { CustomerFormData } from "#wpayment/types";

const props = defineProps<{
	editing: boolean;
	initialData?: CustomerFormData;
}>();

const emit = defineEmits<{
	save: [data: CustomerFormData];
	cancel: [];
}>();

const form = ref<CustomerFormData>({
	email: "",
	name: "",
	phone: "",
	address: {},
	shipping: {},
	taxExempt: "none",
	metadata: {},
});

watch(() => props.initialData, (data) => {
	if (data) {
		form.value = { ...data };
	}
}, { immediate: true });

const handleSubmit = () => {
	emit("save", form.value);
};
</script>

<template>
	<div class="modal-overlay" @click.self="emit('cancel')">
		<div class="modal-content">
			<h3 class="modal-title">{{ editing ? 'Edit Customer' : 'Add Customer' }}</h3>
			<div class="modal-form">
				<div class="form-field">
					<label class="field-label">Email *</label>
					<input v-model="form.email" type="email" class="field-input" placeholder="customer@example.com" />
				</div>
				<div class="form-field">
					<label class="field-label">Name</label>
					<input v-model="form.name" type="text" class="field-input" placeholder="John Doe" />
				</div>
				<div class="form-field">
					<label class="field-label">Phone</label>
					<input v-model="form.phone" type="tel" class="field-input" placeholder="+1 555 123 4567" />
				</div>
				<div class="form-row">
					<div class="form-field">
						<label class="field-label">Address Line 1</label>
						<input v-model="form.address.line1" type="text" class="field-input" />
					</div>
					<div class="form-field">
						<label class="field-label">Address Line 2</label>
						<input v-model="form.address.line2" type="text" class="field-input" />
					</div>
				</div>
				<div class="form-row">
					<div class="form-field">
						<label class="field-label">City</label>
						<input v-model="form.address.city" type="text" class="field-input" />
					</div>
					<div class="form-field">
						<label class="field-label">State</label>
						<input v-model="form.address.state" type="text" class="field-input" />
					</div>
				</div>
				<div class="form-row">
					<div class="form-field">
						<label class="field-label">Postal Code</label>
						<input v-model="form.address.postal_code" type="text" class="field-input" />
					</div>
					<div class="form-field">
						<label class="field-label">Country</label>
						<select v-model="form.address.country" class="field-select">
							<option value="US">United States</option>
							<option value="GB">United Kingdom</option>
							<option value="CA">Canada</option>
							<option value="AU">Australia</option>
						</select>
					</div>
				</div>
			</div>
			<div class="modal-actions">
				<button class="btn-secondary" @click="emit('cancel')">Cancel</button>
				<button class="btn-primary" @click="handleSubmit">{{ editing ? 'Update' : 'Create' }}</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
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
</style>
