import { ref } from "vue"
import type { Employee, EmployeeRole as Role } from "~~/shared/types"

export const useStaff = () => {
	const staffMember = ref<Employee | null>(null)
	const roles = ref<Role[]>([])
	const loading = ref(false)

	const fetchRoles = async () => {
		// Mock data for now
		roles.value = [
			{ id: "1", name: "Admin", description: "Full access", permissions: [], level: 1 },
			{
				id: "2",
				name: "Manager",
				description: "Store management access",
				permissions: [],
				level: 2,
			},
			{ id: "3", name: "Cashier", description: "POS access", permissions: [], level: 3 },
		]
	}

	const fetchStaffMember = async (id: string) => {
		loading.value = true
		try {
			// Mock data for now
			const staffList: Employee[] = [
				{
					id: "1",
					username: "johndoe",
					email: "john@example.com",
					firstName: "John",
					lastName: "Doe",
					phone: "1234567890",
					role: { id: "1", name: "Admin", description: "Full access", permissions: [], level: 1 },
					permissions: [],
					stores: ["1"],
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "2",
					username: "janesmith",
					email: "jane@example.com",
					firstName: "Jane",
					lastName: "Smith",
					phone: "0987654321",
					role: {
						id: "2",
						name: "Manager",
						description: "Store management access",
						permissions: [],
						level: 2,
					},
					permissions: [],
					stores: ["1", "2"],
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]
			staffMember.value = staffList.find(s => s.id === id) || null
		} catch (error) {
			console.error(`Failed to fetch staff member ${id}:`, error)
		} finally {
			loading.value = false
		}
	}

	return {
		staffMember,
		roles,
		loading,
		fetchRoles,
		fetchStaffMember,
	}
}
