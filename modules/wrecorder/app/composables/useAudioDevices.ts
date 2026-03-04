export interface AudioDevice {
	deviceId: string;
	label: string;
	kind: MediaDeviceKind;
}

export const useAudioDevices = () => {
	const audioInputDevices = ref<AudioDevice[]>([]);
	const selectedAudioDevice = ref<string>("");
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const getAudioDevices = async () => {
		try {
			isLoading.value = true;
			error.value = null;

			const devices = await navigator.mediaDevices.enumerateDevices();
			const audioInputs = devices.filter((device) => device.kind === "audioinput");

			audioInputDevices.value = audioInputs.map((device) => ({
				deviceId: device.deviceId,
				label: device.label || `Microphone ${audioInputs.indexOf(device) + 1}`,
				kind: device.kind,
			}));

			if (audioInputs.length > 0 && !selectedAudioDevice.value && audioInputs[0]) {
				selectedAudioDevice.value = audioInputs[0].deviceId;
			}
		} catch (err) {
			error.value = "Failed to get audio devices";
			console.error("Error getting audio devices:", err);
		} finally {
			isLoading.value = false;
		}
	};

	const requestAudioPermission = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			await getAudioDevices();
		} catch (err) {
			error.value = "Failed to request audio permission";
			console.error("Error requesting audio permission:", err);
		}
	};

	onMounted(() => {
		void getAudioDevices();
	});

	return {
		audioInputDevices,
		selectedAudioDevice,
		isLoading,
		error,
		getAudioDevices,
		requestAudioPermission,
	};
};
