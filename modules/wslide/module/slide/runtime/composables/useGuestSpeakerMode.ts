import { ref, computed } from "vue";

export interface GuestSpeaker {
	id: string;
	name: string;
	email: string;
	role: "speaker" | "co-host" | "moderator";
	permissions: {
		navigateSlides: boolean;
		annotate: boolean;
		manageQa: boolean;
		shareScreen: boolean;
	};
	isActive: boolean;
	joinedAt?: Date;
}

export interface SpeakerHandoff {
	from: string;
	to: string;
	atSlide: number;
	timestamp: Date;
}

export function useGuestSpeakerMode() {
	const speakers = ref<GuestSpeaker[]>([]);
	const currentSpeaker = ref<GuestSpeaker | null>(null);
	const handoffHistory = ref<SpeakerHandoff[]>([]);
	const isSharingControl = ref(false);
	const wsConnection = ref<WebSocket | null>(null);

	const activeSpeakers = computed(() => 
		speakers.value.filter(s => s.isActive)
	);

	const canCurrentSpeakerNavigate = computed(() => {
		if (!currentSpeaker.value) return false;
		return currentSpeaker.value.permissions.navigateSlides;
	});

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/speakers?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
	}

	function handleMessage(data: { 
		type: string; 
		speaker?: GuestSpeaker;
		speakerId?: string;
		handoff?: SpeakerHandoff;
	}) {
		switch (data.type) {
			case "speaker_joined":
				if (data.speaker) {
					speakers.value.push({
						...data.speaker,
						joinedAt: new Date(),
					});
				}
				break;
			case "speaker_left":
				if (data.speakerId) {
					const speaker = speakers.value.find(s => s.id === data.speakerId);
					if (speaker) speaker.isActive = false;
					if (currentSpeaker.value?.id === data.speakerId) {
						currentSpeaker.value = null;
					}
				}
				break;
			case "handoff":
				if (data.handoff) {
					handoffHistory.value.push({
						...data.handoff,
						timestamp: new Date(data.handoff.timestamp),
					});
					const newSpeaker = speakers.value.find(s => s.id === data.handoff!.to);
					if (newSpeaker) currentSpeaker.value = newSpeaker;
				}
				break;
			case "permissions_updated":
				if (data.speaker) {
					const index = speakers.value.findIndex(s => s.id === data.speaker!.id);
					if (index > -1) {
						speakers.value[index] = data.speaker;
					}
				}
				break;
		}
	}

	function inviteSpeaker(name: string, email: string, role: GuestSpeaker["role"] = "speaker"): GuestSpeaker {
		const permissions = getDefaultPermissions(role);
		
		const speaker: GuestSpeaker = {
			id: `speaker-${Date.now()}`,
			name,
			email,
			role,
			permissions,
			isActive: false,
		};
		
		speakers.value.push(speaker);
		
		wsConnection.value?.send(JSON.stringify({
			type: "invite_speaker",
			speaker,
		}));
		
		return speaker;
	}

	function getDefaultPermissions(role: GuestSpeaker["role"]): GuestSpeaker["permissions"] {
		switch (role) {
			case "co-host":
				return {
					navigateSlides: true,
					annotate: true,
					manageQa: true,
					shareScreen: true,
				};
			case "moderator":
				return {
					navigateSlides: false,
					annotate: false,
					manageQa: true,
					shareScreen: false,
				};
			default: // speaker
				return {
					navigateSlides: true,
					annotate: true,
					manageQa: false,
					shareScreen: true,
				};
		}
	}

	function updatePermissions(
		speakerId: string, 
		permissions: Partial<GuestSpeaker["permissions"]>
	): void {
		const speaker = speakers.value.find(s => s.id === speakerId);
		if (!speaker) return;
		
		speaker.permissions = { ...speaker.permissions, ...permissions };
		
		wsConnection.value?.send(JSON.stringify({
			type: "update_permissions",
			speaker: { ...speaker, permissions: speaker.permissions },
		}));
	}

	function handoffTo(speakerId: string, atSlide: number): void {
		const fromId = currentSpeaker.value?.id || "host";
		
		wsConnection.value?.send(JSON.stringify({
			type: "handoff",
			from: fromId,
			to: speakerId,
			atSlide,
			timestamp: Date.now(),
		}));
	}

	function requestControl(): void {
		wsConnection.value?.send(JSON.stringify({
			type: "request_control",
			speakerId: currentSpeaker.value?.id,
		}));
	}

	function releaseControl(): void {
		wsConnection.value?.send(JSON.stringify({
			type: "release_control",
			speakerId: currentSpeaker.value?.id,
		}));
		isSharingControl.value = false;
	}

	function removeSpeaker(speakerId: string): void {
		const index = speakers.value.findIndex(s => s.id === speakerId);
		if (index > -1) {
			speakers.value.splice(index, 1);
			
			wsConnection.value?.send(JSON.stringify({
				type: "remove_speaker",
				speakerId,
			}));
		}
	}

	function getSpeakerStats(speakerId: string) {
		handoffHistory.value.filter(h => h.to === speakerId);
		
		return {
			sessions: handoffHistory.value.filter(h => h.to === speakerId).length,
			totalSlides: handoffHistory.value
				.filter(h => h.to === speakerId)
				.reduce((sum, h) => sum + h.atSlide, 0),
		};
	}

	function disconnect(): void {
		wsConnection.value?.close();
		wsConnection.value = null;
	}

	return {
		speakers: readonly(speakers),
		currentSpeaker: readonly(currentSpeaker),
		handoffHistory: readonly(handoffHistory),
		isSharingControl: readonly(isSharingControl),
		activeSpeakers,
		canCurrentSpeakerNavigate,
		connect,
		inviteSpeaker,
		updatePermissions,
		handoffTo,
		requestControl,
		releaseControl,
		removeSpeaker,
		getSpeakerStats,
		disconnect,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
