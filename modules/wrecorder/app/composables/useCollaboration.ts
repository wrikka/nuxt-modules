export interface CollaborationSession {
	id: string;
	hostId: string;
	participants: CollaborationParticipant[];
	createdAt: number;
	startedAt?: number;
	endedAt?: number;
}

export interface CollaborationParticipant {
	id: string;
	name: string;
	role: "host" | "participant";
	isRecording: boolean;
	stream?: MediaStream;
	isConnected: boolean;
	joinedAt: number;
}

export interface CollaborationState {
	session?: CollaborationSession;
	isHost: boolean;
	localStream?: MediaStream;
	isConnecting: boolean;
	error?: string;
}

export const useCollaboration = () => {
	const state = reactive<CollaborationState>({
		isHost: false,
		isConnecting: false,
	});

	let peerConnection: RTCPeerConnection | null = null;
	let signalingSocket: WebSocket | null = null;

	const createSession = async (hostName: string): Promise<string> => {
		const sessionId = `collab-${Date.now()}`;
		const participantId = `user-${Date.now()}`;

		state.session = {
			id: sessionId,
			hostId: participantId,
			participants: [{
				id: participantId,
				name: hostName,
				role: "host",
				isRecording: false,
				isConnected: true,
				joinedAt: Date.now(),
			}],
			createdAt: Date.now(),
		};

		state.isHost = true;
		return sessionId;
	};

	const joinSession = async (sessionId: string, userName: string): Promise<boolean> => {
		state.isConnecting = true;

		try {
			// สร้าง local stream
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			state.localStream = stream;

			const participantId = `user-${Date.now()}`;
			
			state.session = {
				id: sessionId,
				hostId: "", // จะได้รับจาก signaling
				participants: [{
					id: participantId,
					name: userName,
					role: "participant",
					isRecording: false,
					stream,
					isConnected: false,
					joinedAt: Date.now(),
				}],
				createdAt: Date.now(),
			};

			state.isHost = false;
			state.isConnecting = false;
			
			return true;
		} catch (error) {
			state.error = error instanceof Error ? error.message : "Failed to join session";
			state.isConnecting = false;
			return false;
		}
	};

	const leaveSession = () => {
		// หยุดการส่งสัญญาณ
		if (signalingSocket) {
			signalingSocket.close();
			signalingSocket = null;
		}

		// ปิด peer connection
		if (peerConnection) {
			peerConnection.close();
			peerConnection = null;
		}

		// หยุด local stream
		if (state.localStream) {
			state.localStream.getTracks().forEach(track => track.stop());
			state.localStream = undefined;
		}

		state.session = undefined;
		state.isHost = false;
	};

	const startRecording = () => {
		const participant = state.session?.participants.find(
			p => p.id === getCurrentParticipantId()
		);
		if (participant) {
			participant.isRecording = true;
		}
	};

	const stopRecording = () => {
		const participant = state.session?.participants.find(
			p => p.id === getCurrentParticipantId()
		);
		if (participant) {
			participant.isRecording = false;
		}
	};

	const getCurrentParticipantId = (): string => {
		if (!state.session) return "";
		return state.session.participants.find(p => 
			(state.isHost && p.role === "host") || (!state.isHost && p.role === "participant")
		)?.id || "";
	};

	const getParticipantCount = (): number => {
		return state.session?.participants.filter(p => p.isConnected).length || 0;
	};

	const kickParticipant = (participantId: string) => {
		if (!state.isHost || !state.session) return;
		
		state.session.participants = state.session.participants.filter(
			p => p.id !== participantId
		);
	};

	const muteParticipant = (participantId: string) => {
		const participant = state.session?.participants.find(p => p.id === participantId);
		if (participant?.stream) {
			participant.stream.getAudioTracks().forEach(track => {
				track.enabled = !track.enabled;
			});
		}
	};

	const endSession = () => {
		if (!state.isHost || !state.session) return;

		state.session.endedAt = Date.now();
		leaveSession();
	};

	// Sync recording state between participants
	const syncRecordingState = () => {
		if (!state.session) return;

		const activeRecorders = state.session.participants.filter(p => p.isRecording);
		
		// ส่งสถานะไปยังทุกคน
		// ในการ implement จริง ควรใช้ WebRTC data channel หรือ WebSocket
		console.log("Syncing recording state:", activeRecorders.length, "active");
	};

	onUnmounted(() => {
		leaveSession();
	});

	return {
		state: readonly(state),
		session: computed(() => state.session),
		isHost: computed(() => state.isHost),
		participantCount: computed(() => getParticipantCount()),
		createSession,
		joinSession,
		leaveSession,
		startRecording,
		stopRecording,
		kickParticipant,
		muteParticipant,
		endSession,
		syncRecordingState,
	};
};
