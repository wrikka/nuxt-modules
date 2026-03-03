import type { Device } from "../shared/types/advanced"

export const useWorkOSDevices = () => {
	const getUserDevices = async (userId: string): Promise<Device[]> => {
		return await $fetch(`/api/workos/devices/${userId}`)
	}

	const revokeDevice = async (deviceId: string): Promise<void> => {
		await $fetch(`/api/workos/devices/${deviceId}`, {
			method: "DELETE",
		})
	}

	const trustDevice = async (deviceId: string): Promise<Device> => {
		return await $fetch(`/api/workos/devices/${deviceId}/trust`, {
			method: "POST",
		})
	}

	return {
		getUserDevices,
		revokeDevice,
		trustDevice,
	}
}
