<script setup lang="ts">
import { useOnboarding } from "../../../composables/useOnboarding";
import OnboardingWelcome from "./steps/OnboardingWelcome.vue";
import OnboardingProfile from "./steps/OnboardingProfile.vue";
import OnboardingSecurity from "./steps/OnboardingSecurity.vue";
import OnboardingNotifications from "./steps/OnboardingNotifications.vue";
import OnboardingTeam from "./steps/OnboardingTeam.vue";
import OnboardingComplete from "./steps/OnboardingComplete.vue";

const {
	organizationName,
	currentStep,
	steps,
	profileData,
	securityData,
	notificationData,
	teamMembers,
	progressPercentage,
	notificationCount,
	canProceed,
	nextStep,
	prevStep,
	uploadAvatar,
	messageMember,
	goToDashboard,
} = useOnboarding();

const stepComponents = [
	OnboardingWelcome,
	OnboardingProfile,
	OnboardingSecurity,
	OnboardingNotifications,
	OnboardingTeam,
	OnboardingComplete,
];
</script>

<template>
	<div class="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
		<!-- Progress Header -->
		<div class="mb-8">
			<div class="h-1 bg-gray-200 rounded-full mb-4">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progressPercentage}%` }"
				/>
			</div>
			<div class="flex justify-between">
				<div
					v-for="(step, index) in steps"
					:key="index"
					class="flex flex-col items-center gap-2"
					:class="{ 'opacity-50': currentStep < index }"
				>
					<div
						class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
						:class="[
							currentStep > index ? 'bg-green-500 text-white' :
							currentStep === index ? 'bg-blue-500 text-white' :
							'bg-gray-200 text-gray-600'
						]"
					>
						{{ currentStep > index ? '✓' : index + 1 }}
					</div>
					<span class="text-xs text-gray-500">{{ step.title }}</span>
				</div>
			</div>
		</div>

		<!-- Step Content -->
		<div class="min-h-[400px]">
			<OnboardingWelcome
				v-if="currentStep === 0"
				:organization-name="organizationName"
				:steps-count="steps.length"
				@start="nextStep"
			/>
			<OnboardingProfile
				v-else-if="currentStep === 1"
				v-model:data="profileData"
				@upload="uploadAvatar"
			/>
			<OnboardingSecurity
				v-else-if="currentStep === 2"
				v-model:data="securityData"
			/>
			<OnboardingNotifications
				v-else-if="currentStep === 3"
				v-model:data="notificationData"
			/>
			<OnboardingTeam
				v-else-if="currentStep === 4"
				:members="teamMembers"
				@message="messageMember"
			/>
			<OnboardingComplete
				v-else-if="currentStep === 5"
				:profile-name="`${profileData.firstName} ${profileData.lastName}`"
				:mfa-enabled="securityData.mfaEnabled"
				:notification-count="notificationCount"
				@complete="goToDashboard"
			/>
		</div>

		<!-- Navigation Footer -->
		<div v-if="currentStep > 0 && currentStep < 5" class="flex justify-between pt-6 mt-6 border-t border-gray-200">
			<WorkOSButton variant="secondary" @click="prevStep">Back</WorkOSButton>
			<WorkOSButton variant="primary" :disabled="!canProceed" @click="nextStep">
				{{ currentStep === 4 ? 'Complete Setup' : 'Continue' }}
			</WorkOSButton>
		</div>
	</div>
</template>
