export interface VoiceProfile {
	id: string;
	name: string;
	sampleAudioUrl?: string;
	embeddings?: Float32Array;
	language: string;
	pitch: number;
	speed: number;
	isCloned: boolean;
	createdAt: number;
}

export interface VoiceCloningState {
	profiles: VoiceProfile[];
	isRecording: boolean;
	isProcessing: boolean;
	progress: number;
	currentProfile?: VoiceProfile;
	minSampleDuration: number;
}

export const useVoiceCloning = () => {
	const state = reactive<VoiceCloningState>({
		profiles: [],
		isRecording: false,
		isProcessing: false,
		progress: 0,
		minSampleDuration: 30,
	});

	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];

	const createProfile = (name: string, language = "th"): string => {
		const id = `voice-${Date.now()}`;
		const profile: VoiceProfile = {
			id,
			name,
			language,
			pitch: 1,
			speed: 1,
			isCloned: false,
			createdAt: Date.now(),
		};
		state.profiles.push(profile);
		return id;
	};

	const startRecordingSample = async (profileId: string) => {
		const profile = state.profiles.find(p => p.id === profileId);
		if (!profile) return false;

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);
			recordedChunks = [];

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) {
					recordedChunks.push(e.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(recordedChunks, { type: "audio/webm" });
				profile.sampleAudioUrl = URL.createObjectURL(blob);
				processVoiceSample(profileId, blob);
			};

			mediaRecorder.start();
			state.isRecording = true;
			state.currentProfile = profile;

			return true;
		} catch {
			return false;
		}
	};

	const stopRecordingSample = () => {
		mediaRecorder?.stop();
		mediaRecorder?.stream.getTracks().forEach(t => t.stop());
		state.isRecording = false;
	};

	const processVoiceSample = async (profileId: string, audioBlob: Blob) => {
		state.isProcessing = true;
		state.progress = 0;

		const profile = state.profiles.find(p => p.id === profileId);
		if (!profile) return;

		try {
			// Simulate voice cloning process
			const audioContext = new AudioContext();
			const arrayBuffer = await audioBlob.arrayBuffer();
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

			// Check minimum duration
			if (audioBuffer.duration < state.minSampleDuration) {
				console.warn(`Sample too short: ${audioBuffer.duration}s. Need ${state.minSampleDuration}s minimum.`);
			}

			// Extract features (simplified - in reality would use ML model)
			const embeddings = await extractVoiceFeatures(audioBuffer);
			profile.embeddings = embeddings;
			profile.isCloned = true;

			state.progress = 100;
		} catch (error) {
			console.error("Voice cloning failed:", error);
		} finally {
			state.isProcessing = false;
		}
	};

	const extractVoiceFeatures = async (audioBuffer: AudioBuffer): Promise<Float32Array> => {
		// Simplified feature extraction
		// In production, this would use a proper ML model like OpenVoice, Coqui TTS, etc.
		const channelData = audioBuffer.getChannelData(0);
		const sampleRate = audioBuffer.sampleRate;

		// Extract MFCC-like features (simplified)
		const frameSize = 1024;
		const hopSize = 512;
		const numFrames = Math.floor((channelData.length - frameSize) / hopSize) + 1;
		const numFeatures = 13;

		const features = new Float32Array(numFrames * numFeatures);

		for (let i = 0; i < numFrames; i++) {
			const start = i * hopSize;
			const frame = channelData.slice(start, start + frameSize);

			// Simple energy-based features (placeholder)
			let energy = 0;
			for (let j = 0; j < frame.length; j++) {
				energy += frame[j] * frame[j];
			}
			energy = Math.sqrt(energy / frame.length);

			features[i * numFeatures] = energy;
			// Fill rest with derived features
			for (let f = 1; f < numFeatures; f++) {
				features[i * numFeatures + f] = energy * (0.9 + f * 0.01);
			}
		}

		return features;
	};

	const synthesizeSpeech = async (text: string, profileId: string): Promise<Blob | null> => {
		const profile = state.profiles.find(p => p.id === profileId);
		if (!profile?.isCloned) return null;

		// In production, this would use the cloned voice to synthesize
		// For now, return a placeholder using Web Speech API with pitch adjustment
		return new Promise((resolve) => {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.pitch = profile.pitch;
			utterance.rate = profile.speed;
			utterance.lang = profile.language;

			// Create a simple audio blob as placeholder
			const placeholderBlob = new Blob([], { type: "audio/wav" });
			resolve(placeholderBlob);
		});
	};

	const updateProfile = (profileId: string, updates: Partial<VoiceProfile>) => {
		const index = state.profiles.findIndex(p => p.id === profileId);
		if (index !== -1) {
			state.profiles[index] = { ...state.profiles[index], ...updates };
		}
	};

	const deleteProfile = (profileId: string) => {
		state.profiles = state.profiles.filter(p => p.id !== profileId);
		if (state.currentProfile?.id === profileId) {
			state.currentProfile = undefined;
		}
	};

	const getClonedProfiles = (): VoiceProfile[] => {
		return state.profiles.filter(p => p.isCloned);
	};

	return {
		state: readonly(state),
		profiles: computed(() => state.profiles),
		clonedProfiles: computed(() => getClonedProfiles()),
		createProfile,
		startRecordingSample,
		stopRecordingSample,
		synthesizeSpeech,
		updateProfile,
		deleteProfile,
	};
};
