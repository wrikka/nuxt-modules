import { ref, computed } from "vue";

export interface HandRaiseRequest {
	id: string;
	userId: string;
	userName: string;
	question?: string;
	priority: "normal" | "high";
	raisedAt: Date;
	isAnswered: boolean;
}

export function useHandRaise() {
	const requests = ref<HandRaiseRequest[]>([]);
	const currentUserRequest = ref<HandRaiseRequest | null>(null);
	const wsConnection = ref<WebSocket | null>(null);

	const pendingRequests = computed(() => 
		requests.value.filter(r => !r.isAnswered)
	);
	
	const highPriorityRequests = computed(() => 
		pendingRequests.value.filter(r => r.priority === "high")
	);
	
	const queuePosition = computed(() => {
		if (!currentUserRequest.value) return -1;
		return pendingRequests.value.findIndex(r => r.id === currentUserRequest.value!.id) + 1;
	});

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/handraise?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
	}

	function handleMessage(data: { type: string; request?: HandRaiseRequest; requests?: HandRaiseRequest[]; requestId?: string }) {
		switch (data.type) {
			case "requests_list":
				if (data.requests) requests.value = data.requests;
				break;
			case "request_added":
				if (data.request) requests.value.push(data.request);
				break;
			case "request_answered":
				if (data.requestId) {
					const req = requests.value.find(r => r.id === data.requestId);
					if (req) req.isAnswered = true;
					if (currentUserRequest.value?.id === data.requestId) {
						currentUserRequest.value.isAnswered = true;
					}
				}
				break;
			case "request_removed":
				if (data.requestId) {
					const index = requests.value.findIndex(r => r.id === data.requestId);
					if (index > -1) requests.value.splice(index, 1);
					if (currentUserRequest.value?.id === data.requestId) {
						currentUserRequest.value = null;
					}
				}
				break;
		}
	}

	function raiseHand(question?: string, priority: "normal" | "high" = "normal"): void {
		wsConnection.value?.send(JSON.stringify({
			type: "raise_hand",
			question,
			priority,
		}));
	}

	function lowerHand(): void {
		if (!currentUserRequest.value) return;
		
		wsConnection.value?.send(JSON.stringify({
			type: "lower_hand",
			requestId: currentUserRequest.value.id,
		}));
	}

	function markAnswered(requestId: string): void {
		wsConnection.value?.send(JSON.stringify({
			type: "mark_answered",
			requestId,
		}));
	}

	function answerNext(): HandRaiseRequest | null {
		const next = highPriorityRequests.value[0] || pendingRequests.value[0];
		if (next) {
			markAnswered(next.id);
		}
		return next || null;
	}

	function clearAll(): void {
		wsConnection.value?.send(JSON.stringify({
			type: "clear_all",
		}));
	}

	function disconnect(): void {
		wsConnection.value?.close();
		wsConnection.value = null;
	}

	return {
		requests: readonly(requests),
		currentUserRequest: readonly(currentUserRequest),
		pendingRequests,
		highPriorityRequests,
		queuePosition,
		connect,
		raiseHand,
		lowerHand,
		markAnswered,
		answerNext,
		clearAll,
		disconnect,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
