import type { SmartComponentInstance, SmartComponentMaster } from "#shared/types";
import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSmartComponentStore = defineStore("smartComponent", () => {
	const masters = ref<Map<string, SmartComponentMaster>>(new Map());
	const instances = ref<Map<string, SmartComponentInstance>>(new Map());

	const createMaster = (master: Omit<SmartComponentMaster, "id">) => {
		const id = nanoid();
		const newMaster = { ...master, id };
		masters.value.set(id, newMaster);
		return newMaster;
	};

	const updateMaster = (id: string, updates: Partial<SmartComponentMaster>) => {
		const master = masters.value.get(id);
		if (master) {
			masters.value.set(id, { ...master, ...updates });
		}
	};

	const deleteMaster = (id: string) => {
		masters.value.delete(id);
		// Also delete all instances of this master
		for (const [instanceId, instance] of instances.value.entries()) {
			if (instance.masterId === id) {
				instances.value.delete(instanceId);
			}
		}
	};

	const createInstance = (instance: Omit<SmartComponentInstance, "id">) => {
		const id = nanoid();
		const newInstance = { ...instance, id };
		instances.value.set(id, newInstance);
		return newInstance;
	};

	const updateInstance = (id: string, updates: Partial<SmartComponentInstance>) => {
		const instance = instances.value.get(id);
		if (instance) {
			instances.value.set(id, { ...instance, ...updates });
		}
	};

	const deleteInstance = (id: string) => {
		instances.value.delete(id);
	};

	return {
		masters,
		instances,
		createMaster,
		updateMaster,
		deleteMaster,
		createInstance,
		updateInstance,
		deleteInstance,
	};
});
