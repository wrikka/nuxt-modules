<script setup lang="ts">
const {
	rules,
	isRuleBuilderOpen,
	editingRule,
	fetchRules,
	createRule,
	toggleRule,
	deleteRule,
	openRuleBuilder,
	closeRuleBuilder,
	getTriggerLabel,
	getActionLabel,
} = useWorkflowAutomation()

const newRule = ref({
	name: "",
	trigger: { type: "status_change" as const, conditions: [] },
	actions: [{ type: "send_notification" as const, config: {} }],
})

const handleCreateRule = async () => {
	await createRule({
		...newRule.value,
		enabled: true,
	})
	closeRuleBuilder()
	newRule.value = {
		name: "",
		trigger: { type: "status_change", conditions: [] },
		actions: [{ type: "send_notification", config: {} }],
	}
}

onMounted(() => {
	fetchRules()
})
</script>

<template>
	<div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Workflow Automation</h2>
				<p class="text-sm text-gray-500">Create rules to automate your workflow</p>
			</div>
			<button
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				@click="openRuleBuilder()"
			>
				<Icon name="mdi:plus" class="w-4 h-4 inline mr-1" />
				Create Rule
			</button>
		</div>

		<!-- Rules List -->
		<div class="space-y-3">
			<div
				v-for="rule in rules"
				:key="rule.id"
				class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
			>
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<span
							class="w-2 h-2 rounded-full"
							:class="rule.enabled ? 'bg-green-500' : 'bg-gray-400'"
						/>
						<h3 class="font-medium text-gray-900 dark:text-white">{{ rule.name }}</h3>
					</div>
					<p class="text-sm text-gray-500 mt-1">
						When {{ getTriggerLabel(rule.trigger.type) }}
						<span class="mx-1">→</span>
						then {{ rule.actions.map(a => getActionLabel(a.type)).join(', ') }}
					</p>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="relative w-11 h-6 rounded-full transition-colors"
						:class="rule.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
						@click="toggleRule(rule.id)"
					>
						<span
							class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
							:class="rule.enabled ? 'translate-x-5' : 'translate-x-0'"
						/>
					</button>
					<button
						class="p-2 text-gray-400 hover:text-red-500"
						@click="deleteRule(rule.id)"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Rule Builder Modal -->
		<BaseModal v-if="isRuleBuilderOpen" title="Create Automation Rule" @close="closeRuleBuilder">
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
					<input
						v-model="newRule.name"
						type="text"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
						placeholder="e.g., Notify on task completion"
					>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger</label>
					<select
						v-model="newRule.trigger.type"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
					>
						<option value="status_change">Status Changes</option>
						<option value="task_created">Task Created</option>
						<option value="due_date_approaching">Due Date Approaching</option>
						<option value="assigned">Task Assigned</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
					<select
						v-model="newRule.actions[0].type"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
					>
						<option value="send_notification">Send Notification</option>
						<option value="change_status">Change Status</option>
						<option value="assign_user">Assign User</option>
						<option value="add_tag">Add Tag</option>
					</select>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
						@click="closeRuleBuilder"
					>
						Cancel
					</button>
					<button
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						:disabled="!newRule.name"
						@click="handleCreateRule"
					>
						Create Rule
					</button>
				</div>
			</div>
		</BaseModal>
	</div>
</template>
