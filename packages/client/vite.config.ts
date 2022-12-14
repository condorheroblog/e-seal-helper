/// <reference types="vitest" />

import path from 'path'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	server: {
		proxy: {
			'/.netlify': {
				target: 'http://localhost:8888/',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/\.netlify/, '/.netlify'),
			},
		},
	},

	resolve: {
		alias: {
			'~/': `${path.resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [
		Vue({
			reactivityTransform: true,
		}),

		// https://github.com/hannoeru/vite-plugin-pages
		Pages(),

		// https://github.com/antfu/unplugin-auto-import
		AutoImport({
			imports: [
				'vue',
				{
					'naive-ui': [
						'useDialog',
						'useMessage',
						'useNotification',
						'useLoadingBar',
					],
				},
				'vue/macros',
				'vue-router',
				'@vueuse/core',
			],
			dts: true,
			dirs: [
				'./src/composables',
			],
			vueTemplate: true,
		}),

		// https://github.com/antfu/vite-plugin-components
		Components({
			dts: true,
			resolvers: [NaiveUiResolver()],
		}),

		// https://github.com/antfu/unocss
		// see unocss.config.ts for config
		Unocss(),
	],

	// https://github.com/vitest-dev/vitest
	test: {
		environment: 'jsdom',
	},
})
