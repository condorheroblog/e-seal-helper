<script setup lang="ts">
import { useI18nStore } from '~/store/i18n'
const i18nConfig = useI18nStore()
</script>

<template>
	<nav text-xl mt-6 inline-flex gap-2 items-center>
		<button icon-btn @click="i18nConfig.switchLanguage()">
			{{ i18nConfig.locale ? "中文" : "English" }}
		</button>

		<button icon-btn @click="toggleDark()">
			<div dark:i-carbon-moon i-carbon-sun />
		</button>

		<a
			icon-btn i-carbon-logo-github
			rel="noreferrer"
			href="https://github.com/condorheroblog/e-seal-helper"
			target="_blank"
			title="GitHub"
		/>
	</nav>
</template>
