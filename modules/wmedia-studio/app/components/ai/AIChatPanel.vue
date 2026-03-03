<script setup lang="ts">
import type { AIChatContext, AIChatMessage } from "#shared/types/ai";

interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

const messages = ref<AIChatMessage[]>([
	{
		id: "welcome",
		role: "assistant",
		content:
			"สวัสดี! ฉันคือ AI Content Assistant ของคุณ ฉันสามารถช่วยอะไรได้บ้าง?\n\n• แนะนำการจัด layout\n• สร้าง content และ placeholder\n• ปรับปรุง design ให้ดูดีขึ้น\n• ตอบคำถามเกี่ยวกับ features",
		timestamp: new Date(),
	},
]);
const inputMessage = ref("");
const isLoading = ref(false);
const chatContainer = ref<HTMLElement>();

const suggestedPrompts = [
	"แนะนำสีที่เข้ากันสำหรับธีมโมเดิร์น",
	"ช่วยจัด layout ให้สมดุล",
	"สร้าง placeholder text สำหรับ landing page",
	"ตรวจสอบ spacing ให้ consistent",
];

const scrollToBottom = () => {
	nextTick(() => {
		chatContainer.value?.scrollTo({
			top: chatContainer.value.scrollHeight,
			behavior: "smooth",
		});
	});
};

const sendMessage = async () => {
	if (!inputMessage.value.trim() || isLoading.value) return;

	const userMessage: AIChatMessage = {
		id: crypto.randomUUID(),
		role: "user",
		content: inputMessage.value,
		timestamp: new Date(),
	};

	messages.value.push(userMessage);
	inputMessage.value = "";
	scrollToBottom();

	isLoading.value = true;

	// Simulate AI response
	setTimeout(() => {
		const responses = [
			"เข้าใจแล้ว! ฉันแนะนำให้ใช้สีโทนอุ่น พร้อม accent สีน้ำเงิน เพื่อสร้าง contrast",
			"ได้เลย! ควรเพิ่ม white space ระหว่าง sections และใช้ grid 4 columns สำหรับ cards",
			"เยี่ยมไปเลย! ขอแนะนำให้ใช้ font hierarchy ที่ชัดเจน: Heading 32px, Subheading 24px, Body 16px",
			"ฉันสามารถช่วยปรับปรุงได้ ควรใช้ 8px grid system และ alignment แบบ left-aligned สำหรับ readability",
		];

		const response: AIChatMessage = {
			id: crypto.randomUUID(),
			role: "assistant",
			content: responses[Math.floor(Math.random() * responses.length)]!,
			timestamp: new Date(),
		};

		messages.value.push(response);
		isLoading.value = false;
		scrollToBottom();
	}, 1500);
};

const usePrompt = (prompt: string) => {
	inputMessage.value = prompt;
	sendMessage();
};

watch(() => props.isOpen, (open) => {
	if (open) scrollToBottom();
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl z-40"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
					<Icon name="mdi:sparkles" class="text-white w-5 h-5" />
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						AI Assistant
					</h3>
					<p class="text-xs text-gray-500 dark:text-gray-400">พร้อมช่วยคุณเสมอ</p>
				</div>
			</div>
			<button
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
			</button>
		</div>

		<!-- Messages -->
		<div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
			<div
				v-for="message in messages"
				:key="message.id"
				:class="[
					'flex',
					message.role === 'user' ? 'justify-end' : 'justify-start',
				]"
			>
				<div
					:class="[
						'max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
						message.role === 'user'
							? 'bg-blue-500 text-white rounded-br-md'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md',
					]"
				>
					{{ message.content }}
				</div>
			</div>

			<!-- Loading -->
			<div v-if="isLoading" class="flex justify-start">
				<div class="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
					<div class="flex gap-1">
						<div
							class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
							style="animation-delay: 0s"
						/>
						<div
							class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
							style="animation-delay: 0.1s"
						/>
						<div
							class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
							style="animation-delay: 0.2s"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Suggested Prompts -->
		<div
			v-if="!isLoading && messages.length <= 2"
			class="px-4 py-2 border-t border-gray-200 dark:border-gray-700"
		>
			<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">คำแนะนำ:</p>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="prompt in suggestedPrompts"
					:key="prompt"
					class="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors text-left"
					@click="usePrompt(prompt)"
				>
					{{ prompt }}
				</button>
			</div>
		</div>

		<!-- Input -->
		<div class="p-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex gap-2">
				<input
					v-model="inputMessage"
					type="text"
					placeholder="พิมพ์ข้อความ..."
					class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
					@keyup.enter="sendMessage"
				>
				<button
					class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
					:disabled="!inputMessage.trim() || isLoading"
					@click="sendMessage"
				>
					<Icon name="mdi:send" class="w-5 h-5" />
				</button>
			</div>
		</div>
	</div>
</template>
