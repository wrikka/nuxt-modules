import { ref, computed } from "vue";

export type QuizType = "multiple_choice" | "true_false" | "short_answer" | "rating";

export interface QuizQuestion {
	id: string;
	type: QuizType;
	question: string;
	options?: string[];
	correctAnswer?: string | number;
	points: number;
	timeLimit?: number;
}

export interface Quiz {
	id: string;
	title: string;
	description?: string;
	questions: QuizQuestion[];
	isActive: boolean;
	createdAt: Date;
}

export interface QuizResponse {
	questionId: string;
	userId: string;
	answer: string | number;
	isCorrect: boolean;
	points: number;
	answeredAt: Date;
}

export interface QuizResult {
	userId: string;
	userName: string;
	totalPoints: number;
	maxPoints: number;
	percentage: number;
	responses: QuizResponse[];
	completedAt: Date;
}

export function useInteractiveQuizzes() {
	const quizzes = ref<Quiz[]>([]);
	const currentQuiz = ref<Quiz | null>(null);
	const responses = ref<QuizResponse[]>([]);
	const results = ref<QuizResult[]>([]);
	const wsConnection = ref<WebSocket | null>(null);
	const isActive = ref(false);

	const activeQuiz = computed(() => 
		quizzes.value.find(q => q.isActive) || null
	);

	const currentQuestionIndex = computed(() => {
		if (!currentQuiz.value) return -1;
		return Math.floor(responses.value.length / getUniqueRespondents());
	});

	function getUniqueRespondents(): number {
		const unique = new Set(responses.value.map(r => r.userId));
		return unique.size || 1;
	}

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/quizzes?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
	}

	function handleMessage(data: { 
		type: string; 
		quiz?: Quiz; 
		response?: QuizResponse;
		result?: QuizResult;
	}) {
		switch (data.type) {
			case "quiz_started":
				if (data.quiz) {
					currentQuiz.value = data.quiz;
					isActive.value = true;
					responses.value = [];
				}
				break;
			case "quiz_ended":
				isActive.value = false;
				currentQuiz.value = null;
				break;
			case "new_response":
				if (data.response) responses.value.push(data.response);
				break;
			case "results_update":
				if (data.result) {
					const index = results.value.findIndex(r => r.userId === data.result!.userId);
					if (index > -1) {
						results.value[index] = data.result;
					} else {
						results.value.push(data.result);
					}
				}
				break;
		}
	}

	function createQuiz(title: string, questions: QuizQuestion[]): Quiz {
		const quiz: Quiz = {
			id: `quiz-${Date.now()}`,
			title,
			questions,
			isActive: false,
			createdAt: new Date(),
		};
		quizzes.value.push(quiz);
		return quiz;
	}

	function startQuiz(quizId: string): void {
		wsConnection.value?.send(JSON.stringify({
			type: "start_quiz",
			quizId,
		}));
	}

	function submitAnswer(questionId: string, answer: string | number): void {
		wsConnection.value?.send(JSON.stringify({
			type: "submit_answer",
			questionId,
			answer,
			timestamp: Date.now(),
		}));
	}

	function endQuiz(): void {
		wsConnection.value?.send(JSON.stringify({
			type: "end_quiz",
		}));
	}

	function getLeaderboard(limit = 10): QuizResult[] {
		return [...results.value]
			.sort((a, b) => b.totalPoints - a.totalPoints)
			.slice(0, limit);
	}

	function getQuestionStats(questionId: string) {
		const questionResponses = responses.value.filter(r => r.questionId === questionId);
		const total = questionResponses.length;
		const correct = questionResponses.filter(r => r.isCorrect).length;
		
		return {
			total,
			correct,
			incorrect: total - correct,
			accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
		};
	}

	function exportResults(): string {
		return JSON.stringify({
			quiz: currentQuiz.value,
			results: results.value,
			responses: responses.value,
		}, null, 2);
	}

	function disconnect(): void {
		wsConnection.value?.close();
		wsConnection.value = null;
	}

	return {
		quizzes: readonly(quizzes),
		currentQuiz: readonly(currentQuiz),
		responses: readonly(responses),
		results: readonly(results),
		isActive: readonly(isActive),
		activeQuiz,
		currentQuestionIndex,
		connect,
		createQuiz,
		startQuiz,
		submitAnswer,
		endQuiz,
		getLeaderboard,
		getQuestionStats,
		exportResults,
		disconnect,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
