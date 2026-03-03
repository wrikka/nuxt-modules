import { nanoid } from "nanoid"

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const referralConfig = config.public.userAcquisition?.referral

	if (referralConfig?.enabled) {
		const referralCode = useState<string>("referral-code", () => "")

		const checkReferralParam = () => {
			const urlParams = new URLSearchParams(window.location.search)
			const ref = urlParams.get("ref")

			if (ref && !referralCode.value) {
				referralCode.value = ref

				if (referralConfig.trackClicks) {
					$fetch("/api/user-acquisition/referrals/click", {
						method: "POST",
						body: { code: ref },
					}).catch((error) => {
						console.error("Failed to track referral click:", error)
					})
				}
			}
		}

		onMounted(() => {
			checkReferralParam()
		})
	}
})
