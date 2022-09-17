import { acceptHMRUpdate, defineStore } from 'pinia'
import { dateZhCN, zhCN } from 'naive-ui'
import type { NDateLocale, NLocale } from 'naive-ui'

interface I18nConfig {
	locale: NLocale | null
	dateLocale: NDateLocale | null
}

export const useI18nStore = defineStore('i18n', () => {
	const i18n = reactive<I18nConfig>({
		locale: zhCN,
		dateLocale: dateZhCN,
	})

	const locale = computed(() => i18n.locale)
	const dateLocale = computed(() => i18n.dateLocale)

	function switchLanguage() {
		i18n.locale = i18n.locale ? null : zhCN
		i18n.dateLocale = i18n.dateLocale ? null : dateZhCN
	}

	return {
		i18n,
		locale,
		dateLocale,
		switchLanguage,
	}
})

if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useI18nStore, import.meta.hot))
