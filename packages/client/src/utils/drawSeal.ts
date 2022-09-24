import { mergeImage } from './mergeImage'
import { removeBg } from './removeBg'

interface SealOptions {
	canvas: HTMLCanvasElement | null
	canvasRenderingContext2D: CanvasRenderingContext2D | null
	canvasWidth: number
	canvasHeight: number
	coordinateOriginX: number
	coordinateOriginY: number
	scaleX: number
	scaleY: number
	circleRadius?: number
	color: string
	cnFontFamily: string
	enFontFamily: string
	emulateLevel: string
	legalName?: string
	specialName?: string
	infoEncode?: string
}

export class DrawSeal {
	sealOptions: SealOptions = {
		canvas: null,
		canvasRenderingContext2D: null,
		canvasWidth: 500,
		canvasHeight: 500,
		coordinateOriginX: 250,
		coordinateOriginY: 250,
		scaleX: 1,
		scaleY: 1,
		// color: '#FF0000',
		color: '#FF0100',
		cnFontFamily: 'SimSun',
		enFontFamily: 'Arial',
		emulateLevel: '0',
	}

	constructor(sealOptions: Partial<SealOptions>) {
		Object.keys(sealOptions).forEach((key) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			this.sealOptions[key] = sealOptions[key]
		})
		this.createSeal()
	}

	createSeal() {
		const {
			canvasWidth,
			canvasHeight,
		} = this.sealOptions
		const canvas = document.createElement('canvas')
		canvas.width = canvasWidth
		canvas.height = canvasHeight
		const canvasRenderingContext2D = canvas.getContext('2d')
		this.sealOptions.canvas = canvas
		this.sealOptions.canvasRenderingContext2D = canvasRenderingContext2D
		return this
	}

	clearRect() {
		this.sealOptions.canvasRenderingContext2D!.clearRect(0, 0, this.sealOptions.canvasWidth, this.sealOptions.canvasHeight)
		return this
	}

	renderBackground() {
		const canvasRenderingContext2D = this.sealOptions.canvasRenderingContext2D!
		canvasRenderingContext2D.save()
		canvasRenderingContext2D.fillStyle = '#FFFFFF'
		canvasRenderingContext2D.fillRect(0, 0, this.sealOptions.canvasWidth, this.sealOptions.canvasHeight)
		canvasRenderingContext2D.restore()
		return this
	}

	sealScale() {
		this.sealOptions.canvasRenderingContext2D!.scale(this.sealOptions.scaleX, this.sealOptions.scaleY)
		return this
	}

	renderArc(circleRadius?: number) {
		const { canvasRenderingContext2D, coordinateOriginX, coordinateOriginY, color } = this.sealOptions
		canvasRenderingContext2D!.save()
		canvasRenderingContext2D!.lineWidth = 10
		// context.lineJoin = 'bevel';
		canvasRenderingContext2D!.strokeStyle = color
		canvasRenderingContext2D!.beginPath()
		this.sealOptions.circleRadius = circleRadius ?? Math.round(coordinateOriginX - 75)
		canvasRenderingContext2D!.arc(coordinateOriginX, coordinateOriginY, this.sealOptions.circleRadius, 0, Math.PI * 2)
		canvasRenderingContext2D!.stroke()
		canvasRenderingContext2D!.restore()
		return this
	}

	renderStar(rotate = 0, radius = 45) {
		const { canvasRenderingContext2D, color, coordinateOriginX: sx, coordinateOriginY: sy } = this.sealOptions
		const context = canvasRenderingContext2D!
		context.save()
		context.fillStyle = color
		context.translate(sx, sy)
		context.rotate(Math.PI + rotate)
		context.beginPath()
		const dig = Math.PI / 5 * 4
		for (let i = 0; i < 5; i++) {
			const x = Math.sin(i * dig) * radius
			const y = Math.cos(i * dig) * radius
			context.lineTo(x, y)
		}
		context.closePath()
		context.stroke()
		context.fill()
		context.restore()
		return this
	}

	renderLineText(specialNamePaths: string) {
		const { canvasRenderingContext2D, cnFontFamily, color, coordinateOriginX, coordinateOriginY } = this.sealOptions
		const context = canvasRenderingContext2D!
		context.save()
		context.font = `22px ${cnFontFamily}`
		context.textBaseline = 'middle'
		context.textAlign = 'center'
		context.lineWidth = 1
		context.fillStyle = color
		context.save()
		context.translate(coordinateOriginX, coordinateOriginY + 90)
		this.renderPath(specialNamePaths)
		context.restore()
		return this
	}

	rangeCircularText(
		circularPath: string[],
		startAngle = 5 / 6 * Math.PI,
		endAngle = (12 / 6 + 1 / 6) * Math.PI,
		distance = this.sealOptions.circleRadius! - 38,
	) {
		const { canvasRenderingContext2D, coordinateOriginX, coordinateOriginY } = this.sealOptions
		const context = canvasRenderingContext2D!
		context.save()
		const pathLength = circularPath.length
		const angle = (endAngle - startAngle) / (pathLength - 1)
		for (let i = 0; i < pathLength; i++) {
			context.save()
			const c = circularPath[i]
			context.translate(coordinateOriginX, coordinateOriginY)
			const sign = endAngle - startAngle ? 1 : -1
			if (i === 0)
				context.rotate(startAngle)
			else
				context.rotate(sign * i * angle + startAngle)
			context.translate(distance, 0)
			context.rotate(Math.PI / 2)
			this.renderPath(c)
			context.restore()
		}
		return this
	}

	degreeToRadians = (degree: number) => degree * Math.PI / 180

	midpointCircularText(
		circularPath: string[],
		charTiltAngle = 6,
		midAngle = Math.PI / 2,
		distance = this.sealOptions.circleRadius! - 13,
	) {
		const { canvasRenderingContext2D, coordinateOriginX, coordinateOriginY } = this.sealOptions
		const context = canvasRenderingContext2D!
		context.save()
		context.translate(coordinateOriginX, coordinateOriginY)
		const textLength = circularPath.length
		let charAngle = this.degreeToRadians(charTiltAngle)
		if (textLength > 13)
			// 比 90 度多一点点
			charAngle = 13 / 24 * Math.PI / textLength

		const midIndex = Math.floor((textLength - 1) / 2)
		const halfCharAngle = charAngle / 2

		for (let i = 0; i < textLength; i++) {
			const c = circularPath[i]
			context.save()
			// 默认奇数个字
			let rotateExpress = (midIndex - i) * charAngle + midAngle

			// 偶数个字
			if (textLength % 2 === 0) {
				// 中点两边的字旋转半个角度
				if (i === midIndex || i - 1 === midIndex) {
					const signHalfCharAngle = i === midIndex ? halfCharAngle : -halfCharAngle
					rotateExpress = midAngle + signHalfCharAngle
				}
				else {
					if (i < midIndex)
						rotateExpress = midAngle + (midIndex - i) * charAngle + halfCharAngle
					if (i > midIndex)
						rotateExpress = midAngle - (i - midIndex) * charAngle + halfCharAngle
				}
			}
			context.rotate(rotateExpress)
			context.translate(distance, 0)
			// 转正文字
			context.rotate(3 / 2 * Math.PI)
			this.renderPath(c)
			context.restore()
		}

		context.restore()

		return this
	}

	toDataURL() {
		return this.sealOptions.canvas?.toDataURL()
	}

	async blendLayer(imageFilePath: string) {
		let imageFile = imageFilePath
		const { emulateLevel } = this.sealOptions
		if (+emulateLevel) {
			const imageUrl = new URL(`../images/texture/texture-level-${emulateLevel}.jpg`, import.meta.url)
			imageFile = await mergeImage(imageUrl.href, imageFilePath)
		}

		return removeBg(imageFile)
	}

	renderPath(paths: string[] | string) {
		const { canvasRenderingContext2D } = this.sealOptions
		const context = canvasRenderingContext2D!
		if (Array.isArray(paths)) {
			paths.forEach((path) => {
				const p = new Path2D(path)
				context.fill(p)
			})
		}
		else {
			const p = new Path2D(paths)
			context.fill(p)
		}
	}
}
