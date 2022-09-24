// const { globalData } = getApp()
import Dialog from '@vant/weapp/dialog/dialog'
import { ComponentWithStore, storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { fixMidpointCircularText, fixStartPointCircularText, mergeImage, renderFivePointedStar, saveImageToPhotosAlbum } from '../../utils/index'

import { storeBehavior } from '../../store/index'
const warningMessage = '⚠️ 免责声明，工具只供个人学习使用，切勿用于其他用途，因非法使用对自身或者他人造成损失的自行承担相关法律责任。'

ComponentWithStore({
	behaviors: [storeBindingsBehavior],
	storeBindings: storeBehavior,
	options: {
		styleIsolation: 'shared',
	},
	data: {
		isShowPopup: false,
		curFontType: '',
		sealBase64: '',
		warningMessage,
		legalName: '',
		specialName: '',
		infoEncode: '',
		emulateLevel: '0',
		cnFontFamily: '宋体',
		enFontFamily: 'Arial',
	},
	lifetimes: {
		attached() {
			this.setData({
				legalName: '中原武林布袋和尚有限责任公司',
				specialName: '化缘专用章',
				infoEncode: '0123456789ABCDEF',
			})
		},
	},
	methods: {
		async saveSealImage() {
			// wx.previewImage({
			// 	current: this.data.sealBase64,
			// 	urls: [this.data.sealBase64],
			// })
			saveImageToPhotosAlbum(this.data.sealBase64)
		},
		handleNoticeBar() {
			Dialog.alert({
				title: '温馨提示',
				message: warningMessage,
			})
		},
		emulateLevelChange(event: any) {
			this.setData({
				emulateLevel: event.detail,
			})
		},
		openSelectFont(event: WechatMiniprogram.BaseEvent) {
			this.setData({
				curFontType: event.target.dataset.curfonttype,
				isShowPopup: true,
			})
		},
		closeSelectFont() {
			this.setData({
				isShowPopup: false,
			})
		},
		pickerFont(pickEvent: any) {
			const { value } = pickEvent.detail
			if (this.data.curFontType === 'zhFontFamily') {
				this.setData({
					cnFontFamily: value,
				})
			}
			else {
				this.setData({
					enFontFamily: value,
				})
			}

			this.closeSelectFont()
		},
		async createSeal(canvasOptions: any) {
			const {
				legalName,
				specialName,
				cnFontFamily,
				enFontFamily,
				circleRadius,
				infoEncode,
				emulateLevel,
				canvasWidth = 500,
				canvasHeight = 500,
				lineWidth = 7,
				strokeStyle = '#f00',
				fillStyle = '#f00',
				scaleX = 1,
				scaleY = 1,
			} = canvasOptions
			const offscreenCanvas = wx.createOffscreenCanvas({ type: '2d', width: canvasWidth, height: canvasHeight })
			const canvasRenderingContext2D = offscreenCanvas.getContext('2d')

			canvasRenderingContext2D.clearRect(0, 0, canvasWidth, canvasHeight)
			// 绘制白色背景
			canvasRenderingContext2D.fillStyle = '#FFFFFF'
			canvasRenderingContext2D.fillRect(0, 0, canvasWidth, canvasHeight)
			canvasRenderingContext2D.scale(scaleX, scaleY)

			const coordinateOriginX = offscreenCanvas.width / 2
			const coordinateOriginY = offscreenCanvas.height / 2

			canvasRenderingContext2D.lineWidth = lineWidth
			// context.lineJoin = 'bevel';
			canvasRenderingContext2D.strokeStyle = strokeStyle
			canvasRenderingContext2D.beginPath()
			const newCircleRadius = circleRadius || Math.round(coordinateOriginX - 75)
			canvasRenderingContext2D.arc(coordinateOriginX, coordinateOriginY, newCircleRadius, 0, Math.PI * 2)
			canvasRenderingContext2D.stroke()

			// 画五角星
			renderFivePointedStar(canvasRenderingContext2D, coordinateOriginX, coordinateOriginY, 45, strokeStyle, 0)

			// 绘制专用章名称
			canvasRenderingContext2D.font = `22px ${cnFontFamily}`
			canvasRenderingContext2D.textBaseline = 'middle'
			canvasRenderingContext2D.textAlign = 'center'
			canvasRenderingContext2D.lineWidth = 1
			canvasRenderingContext2D.fillStyle = fillStyle
			canvasRenderingContext2D.fillText(specialName, coordinateOriginX, coordinateOriginY + 90)

			// 绘制法定名称
			fixStartPointCircularText(canvasRenderingContext2D, {
				circularText: legalName,
				fontSize: '30px',
				fontFamily: cnFontFamily,
				coordinateOriginX,
				coordinateOriginY,
				distance: newCircleRadius - 22,
				startAngle: 5 / 6 * Math.PI,
				endAngle: (12 / 6 - 4 / 6) * Math.PI,
			})

			// 绘制印章信息编码
			fixMidpointCircularText(canvasRenderingContext2D, {
				circularText: infoEncode,
				fontSize: '20px',
				fontFamily: enFontFamily,
				coordinateOriginX,
				coordinateOriginY,
				distance: newCircleRadius - 15,
				midAngle: Math.PI / 2,
				charTiltAngle: 6,
			})

			const { tempFilePath } = await wx.canvasToTempFilePath({
				canvas: offscreenCanvas,
				// fileType: "jpg"
			})
			if (+emulateLevel) {
				const sealBase64 = await mergeImage(`/images/texture/texture-level-${emulateLevel}.jpg`, tempFilePath)
				this.setData({
					sealBase64,
				})
			}
			else {
				this.setData({
					sealBase64: tempFilePath,
				})
			}
		},
		previewSealImage() {
			// wx.request
		},
	},
	observers: {
		'legalName, specialName, cnFontFamily, infoEncode, emulateLevel, enFontFamily': function (
			legalName: string,
			specialName: string,
			cnFontFamily: string,
			infoEncode: string,
			emulateLevel: number,
			enFontFamily: string,
		) {
			this.createSeal({
				legalName,
				specialName,
				cnFontFamily,
				infoEncode,
				emulateLevel,
				enFontFamily,
			})
		},
	},
})
