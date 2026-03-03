export interface AudioEffect {
	id: string;
	name: string;
	type: "reverb" | "delay" | "eq" | "compression" | "limiter" | "chorus" | "distortion";
	enabled: boolean;
	params: Record<string, number>;
}

export interface AudioEffectsSettings {
	effects: AudioEffect[];
	masterChain: boolean;
}

export const defaultEffects: AudioEffect[] = [
	{
		id: "reverb-1",
		name: "Reverb",
		type: "reverb",
		enabled: false,
		params: {
			roomSize: 50,
			damping: 30,
			wetLevel: 30,
			dryLevel: 70,
			preDelay: 20,
		},
	},
	{
		id: "delay-1",
		name: "Delay",
		type: "delay",
		enabled: false,
		params: {
			time: 300,
			feedback: 40,
			mix: 30,
		},
	},
	{
		id: "eq-1",
		name: "Parametric EQ",
		type: "eq",
		enabled: false,
		params: {
			lowGain: 0,
			lowFreq: 80,
			midGain: 0,
			midFreq: 1000,
			midQ: 1,
			highGain: 0,
			highFreq: 10000,
		},
	},
	{
		id: "compression-1",
		name: "Compressor",
		type: "compression",
		enabled: false,
		params: {
			threshold: -20,
			ratio: 4,
			attack: 10,
			release: 100,
			makeupGain: 0,
		},
	},
	{
		id: "limiter-1",
		name: "Limiter",
		type: "limiter",
		enabled: false,
		params: {
			threshold: -3,
			release: 50,
			lookahead: 5,
		},
	},
	{
		id: "chorus-1",
		name: "Chorus",
		type: "chorus",
		enabled: false,
		params: {
			rate: 1.5,
			depth: 30,
			mix: 40,
		},
	},
	{
		id: "distortion-1",
		name: "Distortion",
		type: "distortion",
		enabled: false,
		params: {
			drive: 30,
			tone: 50,
			mix: 20,
		},
	},
];

export const effectPresets: Record<string, Partial<AudioEffect>[]> = {
	"Voice Enhancement": [
		{ id: "eq-1", enabled: true, params: { lowGain: -3, midGain: 2, highGain: 3 } },
		{ id: "compression-1", enabled: true, params: { threshold: -18, ratio: 3 } },
		{ id: "limiter-1", enabled: true, params: { threshold: -2 } },
	],
	"Radio Voice": [
		{ id: "eq-1", enabled: true, params: { lowGain: -6, midGain: 4, midFreq: 2500, highGain: 2 } },
		{ id: "compression-1", enabled: true, params: { threshold: -15, ratio: 6 } },
		{ id: "distortion-1", enabled: true, params: { drive: 15, mix: 10 } },
	],
	"Concert Hall": [
		{ id: "reverb-1", enabled: true, params: { roomSize: 80, damping: 40, wetLevel: 50 } },
		{ id: "eq-1", enabled: true, params: { highGain: -2 } },
	],
	"Slapback Echo": [
		{ id: "delay-1", enabled: true, params: { time: 150, feedback: 25, mix: 35 } },
		{ id: "eq-1", enabled: true, params: { lowGain: -4, highGain: -2 } },
	],
};

export const effectParamRanges: Record<string, Record<string, { min: number; max: number; step?: number; unit?: string }>> = {
	reverb: {
		roomSize: { min: 0, max: 100, unit: "%" },
		damping: { min: 0, max: 100, unit: "%" },
		wetLevel: { min: 0, max: 100, unit: "%" },
		dryLevel: { min: 0, max: 100, unit: "%" },
		preDelay: { min: 0, max: 100, unit: "ms" },
	},
	delay: {
		time: { min: 10, max: 2000, unit: "ms" },
		feedback: { min: 0, max: 95, unit: "%" },
		mix: { min: 0, max: 100, unit: "%" },
	},
	eq: {
		lowGain: { min: -15, max: 15, unit: "dB" },
		lowFreq: { min: 20, max: 500, unit: "Hz" },
		midGain: { min: -15, max: 15, unit: "dB" },
		midFreq: { min: 200, max: 8000, unit: "Hz" },
		midQ: { min: 0.1, max: 10, step: 0.1 },
		highGain: { min: -15, max: 15, unit: "dB" },
		highFreq: { min: 1000, max: 20000, unit: "Hz" },
	},
	compression: {
		threshold: { min: -60, max: 0, unit: "dB" },
		ratio: { min: 1, max: 20, unit: ":1" },
		attack: { min: 1, max: 100, unit: "ms" },
		release: { min: 10, max: 1000, unit: "ms" },
		makeupGain: { min: 0, max: 30, unit: "dB" },
	},
	limiter: {
		threshold: { min: -20, max: 0, unit: "dB" },
		release: { min: 1, max: 500, unit: "ms" },
		lookahead: { min: 0, max: 20, unit: "ms" },
	},
	chorus: {
		rate: { min: 0.1, max: 10, step: 0.1, unit: "Hz" },
		depth: { min: 0, max: 100, unit: "%" },
		mix: { min: 0, max: 100, unit: "%" },
	},
	distortion: {
		drive: { min: 0, max: 100, unit: "%" },
		tone: { min: 0, max: 100, unit: "%" },
		mix: { min: 0, max: 100, unit: "%" },
	},
};

export const effectIcons: Record<AudioEffect["type"], string> = {
	reverb: "i-ph-wave-sine",
	delay: "i-ph-repeat",
	eq: "i-ph-sliders-horizontal",
	compression: "i-ph-arrows-in-line-vertical",
	limiter: "i-ph-wall",
	chorus: "i-ph-circles-three",
	distortion: "i-ph-wave-triangle",
};

export const presetNames = ["Voice Enhancement", "Radio Voice", "Concert Hall", "Slapback Echo"] as const;
