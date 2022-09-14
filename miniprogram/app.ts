import { store } from './store/index'

const SUPPORT_FONT = new Map([
	['SimSun', '宋体'],
	['SimSong', '宋体'],
	['FangSong', '仿宋'],
	['SimHei', '黑体'],
	['KaiTi', '楷体'],
	['HanyiSentyBubbleTea', '汉仪新蒂珍珠奶茶'],
])

const GITHUB_URL = 'https://github.com/condorheroblog/e-seal-helper/blob/main/miniprogram/static/font/'
const GITHUB_FONT_LIST = new Map([
	['HanyiSentyBubbleTea', `${GITHUB_URL}HanyiSentyBubbleTea.woff2`],
	['FangSong', `${GITHUB_URL}FangSong.woff2`],
	['SimHei', `${GITHUB_URL}SimHei.woff2`],
	['SimSun', `${GITHUB_URL}SimSun.woff2`],
	['KaiTi', `${GITHUB_URL}KaiTi.woff2`],
])

const MINI_APP_URL = 'cloud://mini-app-cloud-zkyxj.6d69-mini-app-cloud-zkyxj-1302237683/'
const MINI_APP_CLOUD_FONT_LIST = new Map([
	// ['HanyiSentyBubbleTea', `${MINI_APP_URL}HanyiSentyBubbleTea.ttf`],
	// ['FangSong', `${MINI_APP_URL}FangSong.ttf`],
	// ['SimHei', `${MINI_APP_URL}SimHei.ttf`],
	// ['SimSun', `${MINI_APP_URL}SimSun.ttf`],
	// ['KaiTi', `${MINI_APP_URL}KaiTi.ttf`],
	['HanyiSentyBubbleTea', `${MINI_APP_URL}HanyiSentyBubbleTea.woff2`],
	['FangSong', `${MINI_APP_URL}FangSong.woff2`],
	['SimHei', `${MINI_APP_URL}SimHei.woff2`],
	['SimSun', `${MINI_APP_URL}SimSun.woff2`],
	['KaiTi', `${MINI_APP_URL}KaiTi.woff2`],
])

const loadFontFace = async (sourceURL: string, family: string) => {
	try {
		await wx.loadFontFace({
			global: true,
			family: SUPPORT_FONT.get(family)!,
			scopes: ['webview', 'native'],
			source: `url("${sourceURL}")`,
		})
		store.updateFontList(SUPPORT_FONT.get(family)!)
	}
	catch (error) {
		wx.showToast({
			title: error.errMsg,
			icon: 'error',
			duration: 2000,
		})
	}
}

const downloadFont = async (family: string) => {
	try {
		const { tempFilePath } = await wx.cloud.downloadFile({
			fileID: MINI_APP_CLOUD_FONT_LIST.get(family)!,
		})
		await loadFontFace(tempFilePath, family)
	}
	catch (error) {
		wx.showToast({
			title: error.errMsg,
			icon: 'error',
			duration: 2000,
		})
		await loadFontFace(GITHUB_FONT_LIST.get(family)!, family)
	}
}

App({
	async onLaunch() {
		/**
		 * download font list
		 * @see https://www.sentyfont.com/download.htm
		 *
		 * one test loadFontFace example
		 * // wx.loadFontFace({
		 * //   family: 'simsun',
		 * //   source: 'url("https://raw.githubusercontent.com/ZsgsDesign/fonts-asset-Simsun/main/simsun.ttf")',
		 * //   success: console.log,
		 * //   fail: console.error
		 * // })
		*/

		/**
		 * 默认支持的字体 [宋体(SimSong/SimSun)、仿宋(FangSong)、黑体(SimHei)，楷体(KaiTi)、汉仪新蒂珍珠奶茶(HanyiSentyBubbleTea)]
		 */
		wx.cloud.init()
		!store.fontList.includes('汉仪新蒂珍珠奶茶') && downloadFont('HanyiSentyBubbleTea')
		!store.fontList.includes('楷体') && downloadFont('KaiTi')
		!store.fontList.includes('黑体') && downloadFont('SimHei')
		!store.fontList.includes('仿宋') && downloadFont('FangSong')
		!store.fontList.includes('宋体') && downloadFont('SimSun')
	},
})
