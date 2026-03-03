export const useGiftCardManager = (refreshCart: () => Promise<void>) => {
	const applyGiftCard = async (code: string) => {
		if (!code) return { success: false, message: "Please enter a gift card code." }
		try {
			await $fetch("/api/cart/gift-card", {
				method: "POST",
				body: { code },
			})
			await refreshCart()
			return { success: true, message: "Gift card applied." }
		} catch (error: unknown) {
			if (error instanceof Error) {
				const message = error.message
				return { success: false, message }
			} else {
				return { success: false, message: "An unknown error occurred." }
			}
		}
	}

	const removeGiftCard = async () => {
		try {
			await $fetch("/api/cart/gift-card", { method: "DELETE" })
			await refreshCart()
			return { success: true, message: "Gift card removed." }
		} catch (error: unknown) {
			if (error instanceof Error) {
				const message = error.message
				return { success: false, message }
			} else {
				return { success: false, message: "An unknown error occurred." }
			}
		}
	}

	return {
		applyGiftCard,
		removeGiftCard,
	}
}
