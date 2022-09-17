<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useI18nStore } from '~/store/i18n'
import { useSpinStore } from '~/store/spin'
const i18nConfig = useI18nStore()
const spin = useSpinStore()
</script>

<template>
	<n-spin :show="spin.isShowSpin">
		<main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
			<n-config-provider :theme="isDark ? darkTheme : null" :locale="i18nConfig.locale" :date-locale="i18nConfig.dateLocale">
				<n-message-provider>
					<router-view />
				</n-message-provider>
			</n-config-provider>
			<Footer />
		</main>
	</n-spin>
</template>
