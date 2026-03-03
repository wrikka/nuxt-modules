<script setup lang="ts">
interface ProfileData {
	avatar: string;
	firstName: string;
	lastName: string;
	jobTitle: string;
	department: string;
	phone: string;
}

const props = defineProps<{
	data: ProfileData;
}>();

const emit = defineEmits<{
	"update:data": [data: ProfileData];
	upload: [];
}>();

const getInitials = (name: string) => name.charAt(0).toUpperCase();

const updateField = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
	emit("update:data", { ...props.data, [field]: value });
};
</script>

<template>
	<div class="step-profile">
		<h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Complete Your Profile</h2>
		<p class="text-gray-600 text-center mb-6">Tell us a bit about yourself</p>

		<div class="max-w-md mx-auto">
			<div class="flex flex-col items-center gap-4 mb-6">
				<div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
					<img v-if="data.avatar" :src="data.avatar" class="w-full h-full object-cover" />
					<div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
						{{ getInitials(data.firstName || 'U') }}
					</div>
				</div>
				<WorkOSButton variant="secondary" sm @click="emit('upload')">Upload Photo</WorkOSButton>
			</div>

			<div class="grid grid-cols-2 gap-4 mb-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
					<input
						:value="data.firstName"
						type="text"
						placeholder="John"
						class="w-full px-3 py-2 border border-gray-300 rounded-md"
						@input="updateField('firstName', ($event.target as HTMLInputElement).value)"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
					<input
						:value="data.lastName"
						type="text"
						placeholder="Doe"
						class="w-full px-3 py-2 border border-gray-300 rounded-md"
						@input="updateField('lastName', ($event.target as HTMLInputElement).value)"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
				<input
					:value="data.jobTitle"
					type="text"
					placeholder="Software Engineer"
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
					@input="updateField('jobTitle', ($event.target as HTMLInputElement).value)"
				/>
			</div>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
				<select
					:value="data.department"
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
					@change="updateField('department', ($event.target as HTMLSelectElement).value)"
				>
					<option value="">Select department</option>
					<option value="engineering">Engineering</option>
					<option value="design">Design</option>
					<option value="marketing">Marketing</option>
					<option value="sales">Sales</option>
					<option value="hr">Human Resources</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div class="mb-4">
				<label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
				<input
					:value="data.phone"
					type="tel"
					placeholder="+1 (555) 000-0000"
					class="w-full px-3 py-2 border border-gray-300 rounded-md"
					@input="updateField('phone', ($event.target as HTMLInputElement).value)"
				/>
			</div>
		</div>
	</div>
</template>
