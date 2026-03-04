import { ref, computed } from "vue";

export interface BreakoutRoom {
	id: string;
	name: string;
	participants: string[];
	maxParticipants: number;
	createdAt: Date;
	expiresAt?: Date;
	isActive: boolean;
}

export interface RoomMessage {
	id: string;
	roomId: string;
	userId: string;
	userName: string;
	content: string;
	timestamp: Date;
}

export function useBreakoutRooms() {
	const rooms = ref<BreakoutRoom[]>([]);
	const currentRoom = ref<BreakoutRoom | null>(null);
	const messages = ref<RoomMessage[]>([]);
	const wsConnection = ref<WebSocket | null>(null);
	const isConnected = ref(false);

	const activeRooms = computed(() => 
		rooms.value.filter(r => r.isActive)
	);
	
	const availableRooms = computed(() => 
		rooms.value.filter(r => r.participants.length < r.maxParticipants && r.isActive)
	);

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/breakout?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onopen = () => {
			isConnected.value = true;
		};
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
		
		wsConnection.value.onclose = () => {
			isConnected.value = false;
		};
	}

	function handleMessage(data: { type: string; room?: BreakoutRoom; message?: RoomMessage; rooms?: BreakoutRoom[] }) {
		switch (data.type) {
			case "rooms_list":
				if (data.rooms) rooms.value = data.rooms;
				break;
			case "room_created":
				if (data.room) rooms.value.push(data.room);
				break;
			case "room_updated":
				if (data.room) {
					const index = rooms.value.findIndex(r => r.id === data.room!.id);
					if (index > -1) rooms.value[index] = data.room;
				}
				break;
			case "joined_room":
				if (data.room) currentRoom.value = data.room;
				break;
			case "left_room":
				if (currentRoom.value?.id === data.room?.id) {
					currentRoom.value = null;
				}
				break;
			case "room_message":
				if (data.message) messages.value.push(data.message);
				break;
		}
	}

	function createRoom(name: string, maxParticipants = 10, durationMinutes?: number): void {
		wsConnection.value?.send(JSON.stringify({
			type: "create_room",
			name,
			maxParticipants,
			durationMinutes,
		}));
	}

	function joinRoom(roomId: string): void {
		wsConnection.value?.send(JSON.stringify({
			type: "join_room",
			roomId,
		}));
	}

	function leaveRoom(): void {
		if (!currentRoom.value) return;
		
		wsConnection.value?.send(JSON.stringify({
			type: "leave_room",
			roomId: currentRoom.value.id,
		}));
	}

	function closeRoom(roomId: string): void {
		wsConnection.value?.send(JSON.stringify({
			type: "close_room",
			roomId,
		}));
	}

	function sendMessage(content: string): void {
		if (!currentRoom.value) return;
		
		wsConnection.value?.send(JSON.stringify({
			type: "send_message",
			roomId: currentRoom.value.id,
			content,
		}));
	}

	function broadcastToAll(message: string): void {
		wsConnection.value?.send(JSON.stringify({
			type: "broadcast",
			message,
		}));
	}

	function assignParticipantsRandomly(participants: string[]): void {
		wsConnection.value?.send(JSON.stringify({
			type: "auto_assign",
			participants,
		}));
	}

	function disconnect(): void {
		wsConnection.value?.close();
		wsConnection.value = null;
		isConnected.value = false;
	}

	return {
		rooms: readonly(rooms),
		currentRoom: readonly(currentRoom),
		messages: readonly(messages),
		isConnected: readonly(isConnected),
		activeRooms,
		availableRooms,
		connect,
		createRoom,
		joinRoom,
		leaveRoom,
		closeRoom,
		sendMessage,
		broadcastToAll,
		assignParticipantsRandomly,
		disconnect,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
