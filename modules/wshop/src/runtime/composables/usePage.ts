import { useFetch } from "#imports"
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

export const usePage = () => {
	const route = useRoute()
	const { locale } = useI18n()

	const slug = computed(() => {
		const paramsSlug = route.params.slug
		const path = Array.isArray(paramsSlug) ? paramsSlug.join("/") : paramsSlug
		// Use a special 'homepage' slug for the root path
		return path || "homepage"
	})

	const { data: page, pending, error } = useFetch(`/api/pages/slug/${slug.value}`, {
		lazy: true,
		query: {
			locale: locale.value,
		},
	})

	watch(() => error.value, (newError) => {
		if (newError) {
			console.error(
				`Page with slug '${slug.value}' and locale '${locale.value}' not found.`,
				newError,
			)
		}
	})

	return { page, pending, error, slug }
}
