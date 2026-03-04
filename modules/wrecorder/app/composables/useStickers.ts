export interface Sticker {
	id: string;
	type: "emoji" | "image" | "text";
	content: string;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
	scale: number;
	createdAt: number;
}

export interface StickerState {
	stickers: Sticker[];
	selectedId?: string;
	isDragging: boolean;
}

export const useStickers = () => {
	const state = reactive<StickerState>({
		stickers: [],
		isDragging: false,
	});

	const addEmoji = (emoji: string, x: number, y: number): string => {
		const id = `sticker-${Date.now()}`;
		const sticker: Sticker = {
			id,
			type: "emoji",
			content: emoji,
			x,
			y,
			width: 40,
			height: 40,
			rotation: 0,
			opacity: 1,
			scale: 1,
			createdAt: Date.now(),
		};
		state.stickers.push(sticker);
		return id;
	};

	const addImage = (url: string, x: number, y: number, width = 100, height = 100): string => {
		const id = `sticker-${Date.now()}`;
		const sticker: Sticker = {
			id,
			type: "image",
			content: url,
			x,
			y,
			width,
			height,
			rotation: 0,
			opacity: 1,
			scale: 1,
			createdAt: Date.now(),
		};
		state.stickers.push(sticker);
		return id;
	};

	const addText = (text: string, x: number, y: number): string => {
		const id = `sticker-${Date.now()}`;
		const sticker: Sticker = {
			id,
			type: "text",
			content: text,
			x,
			y,
			width: 200,
			height: 30,
			rotation: 0,
			opacity: 1,
			scale: 1,
			createdAt: Date.now(),
		};
		state.stickers.push(sticker);
		return id;
	};

	const selectSticker = (id: string) => {
		state.selectedId = id;
	};

	const deselect = () => {
		state.selectedId = undefined;
	};

	const updateSticker = (id: string, updates: Partial<Sticker>) => {
		const index = state.stickers.findIndex(s => s.id === id);
		if (index !== -1) {
			state.stickers[index] = { ...state.stickers[index], ...updates };
		}
	};

	const moveSticker = (id: string, x: number, y: number) => {
		updateSticker(id, { x, y });
	};

	const resizeSticker = (id: string, width: number, height: number) => {
		updateSticker(id, { width, height });
	};

	const rotateSticker = (id: string, rotation: number) => {
		updateSticker(id, { rotation });
	};

	const scaleSticker = (id: string, scale: number) => {
		updateSticker(id, { scale: Math.max(0.1, Math.min(3, scale)) });
	};

	const setOpacity = (id: string, opacity: number) => {
		updateSticker(id, { opacity: Math.max(0, Math.min(1, opacity)) });
	};

	const deleteSticker = (id: string) => {
		state.stickers = state.stickers.filter(s => s.id !== id);
		if (state.selectedId === id) {
			state.selectedId = undefined;
		}
	};

	const clearAll = () => {
		state.stickers = [];
		state.selectedId = undefined;
	};

	const getSelectedSticker = (): Sticker | undefined => {
		return state.stickers.find(s => s.id === state.selectedId);
	};

	const bringToFront = (id: string) => {
		const index = state.stickers.findIndex(s => s.id === id);
		if (index !== -1 && index < state.stickers.length - 1) {
			const [sticker] = state.stickers.splice(index, 1);
			state.stickers.push(sticker);
		}
	};

	const sendToBack = (id: string) => {
		const index = state.stickers.findIndex(s => s.id === id);
		if (index > 0) {
			const [sticker] = state.stickers.splice(index, 1);
			state.stickers.unshift(sticker);
		}
	};

	const startDrag = () => {
		state.isDragging = true;
	};

	const endDrag = () => {
		state.isDragging = false;
	};

	// วาด stickers บน canvas
	const drawStickers = (ctx: CanvasRenderingContext2D) => {
		state.stickers.forEach(sticker => {
			ctx.save();
			ctx.globalAlpha = sticker.opacity;
			ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
			ctx.rotate((sticker.rotation * Math.PI) / 180);
			ctx.scale(sticker.scale, sticker.scale);

			switch (sticker.type) {
				case "emoji":
					ctx.font = `${sticker.width}px serif`;
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(sticker.content, 0, 0);
					break;
				case "text":
					ctx.font = "20px Arial";
					ctx.fillStyle = "#ffffff";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(sticker.content, 0, 0);
					break;
				case "image":
					// สำหรับ image ต้องโหลดก่อน ใช้ callback pattern
					const img = new Image();
					img.onload = () => {
						ctx.drawImage(
							img,
							-sticker.width / 2,
							-sticker.height / 2,
							sticker.width,
							sticker.height
						);
					};
					img.src = sticker.content;
					break;
			}

			ctx.restore();
		});
	};

	return {
		state: readonly(state),
		stickers: computed(() => state.stickers),
		selectedSticker: computed(() => getSelectedSticker()),
		addEmoji,
		addImage,
		addText,
		selectSticker,
		deselect,
		updateSticker,
		moveSticker,
		resizeSticker,
		rotateSticker,
		scaleSticker,
		setOpacity,
		deleteSticker,
		clearAll,
		bringToFront,
		sendToBack,
		startDrag,
		endDrag,
		drawStickers,
	};
};
