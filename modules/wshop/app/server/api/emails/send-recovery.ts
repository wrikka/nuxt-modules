import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { z } from "zod"
import { db } from "~~/server/db"
import { carts } from "~~/server/db/schemas"
// import { useCompiler } from '#vue-email'; // TODO: Re-enable when @vue-email/nuxt supports Nuxt 4

const sendRecoveryEmailSchema = z.object({
	cartId: z.string(),
})

export default defineEventHandler(async (event) => {
	const secret = getHeader(event, "x-cron-secret")
	if (secret !== process.env.CRON_SECRET) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
	}

	const body = await readBody(event)
	const validation = sendRecoveryEmailSchema.safeParse(body)
	if (!validation.success) {
		throw createError({ statusCode: 400, statusMessage: "Invalid request body" })
	}

	const { cartId } = validation.data

	const cart = await db.query.carts.findFirst({
		where: eq(carts.id, cartId),
		with: {
			customer: true,
			items: { with: { product: true } },
		},
	})

	if (!cart || !cart.customer) {
		throw createError({ statusCode: 404, statusMessage: "Cart or customer not found" })
	}

	const runtimeConfig = useRuntimeConfig()
	const resend = new Resend(runtimeConfig.resendApiKey as string)

	const checkoutUrl = `${getRequestURL(event).origin}/checkout?cartId=${cart.id}`

	// TODO: Re-enable when @vue-email/nuxt supports Nuxt 4
	// const template = await useCompiler('AbandonedCart.vue', {
	//   props: {
	//     cart,
	//     checkoutUrl,
	//   },
	// });
	const template = { html: `<body>TODO: Email template. Checkout URL: ${checkoutUrl}</body>` } // Placeholder

	try {
		await resend.emails.send({
			from: runtimeConfig.resendFromEmail as string,
			to: [cart.customer.email!],
			subject: "You left items in your cart!",
			html: template.html,
		})

		await db.update(carts)
			.set({ recoveryEmailSentAt: new Date() })
			.where(eq(carts.id, cartId))

		return { success: true }
	} catch (error) {
		console.error("Failed to send recovery email:", error)
		throw createError({ statusCode: 500, statusMessage: "Failed to send email" })
	}
})
