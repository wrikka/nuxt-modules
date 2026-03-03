<script setup lang="ts">
interface NotificationData {
	email: {
		important: boolean;
		weekly: boolean;
		marketing: boolean;
	};
	push: {
		messages: boolean;
		mentions: boolean;
		tasks: boolean;
	};
}

const props = defineProps<{
	data: NotificationData;
}>();

const emit = defineEmits<{
	"update:data": [data: NotificationData];
}>();

const updateEmail = (key: keyof NotificationData["email"], value: boolean) => {
	emit("update:data", {
		...props.data,
		email: { ...props.data.email, [key]: value },
	});
};

const updatePush = (key: keyof NotificationData["push"], value: boolean) => {
	emit("update:data", {
		...props.data,
		push: { ...props.data.push, [key]: value },
	});
};
</script>

<template>
	<div class="step-notifications">
		<h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Notification Preferences</h2>
		<p class="text-gray-600 text-center mb-6">Choose how you'd like to stay informed</p>

		<div class="max-w-md mx-auto space-y-6">
			<div>
				<h4 class="font-medium text-gray-800 mb-3">Email Notifications</h4>
				<div class="space-y-2">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.email.important"
							class="w-4 h-4"
							@change="updateEmail('important', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Important updates only</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.email.weekly"
							class="w-4 h-4"
							@change="updateEmail('weekly', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Weekly digest</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.email.marketing"
							class="w-4 h-4"
							@change="updateEmail('marketing', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Product updates & tips</span>
					</label>
				</div>
			</div>

			<div>
				<h4 class="font-medium text-gray-800 mb-3">Push Notifications</h4>
				<div class="space-y-2">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.push.messages"
							class="w-4 h-4"
							@change="updatePush('messages', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Direct messages</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.push.mentions"
							class="w-4 h-4"
							@change="updatePush('mentions', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Mentions & replies</span>
					</label>
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							:checked="data.push.tasks"
							class="w-4 h-4"
							@change="updatePush('tasks', ($event.target as HTMLInputElement).checked)"
						/>
						<span class="text-gray-700">Task assignments</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>
