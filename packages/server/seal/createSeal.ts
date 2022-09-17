import { join } from 'node:path'
import { createCanvas, registerFont } from 'canvas'
import dirname from 'es-dirname'
import { mergeImage } from './mergeImage'
import { fixMidpointCircularText, fixStartPointCircularText } from './renderCircularText'
import { renderFivePointedStar } from './renderFivePointedStar'

export const createSeal = async (canvasOptions: any) => {
	const {
		legalName,
		specialName,
		zhCnFontFamily,
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
	const zhCnFontPath = join(dirname(), `../font/${zhCnFontFamily}.ttf`)
	registerFont(zhCnFontPath, { family: zhCnFontFamily })
	const offscreenCanvas = createCanvas(canvasWidth, canvasHeight)
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
	canvasRenderingContext2D.font = `22px ${zhCnFontFamily}`
	canvasRenderingContext2D.textBaseline = 'middle'
	canvasRenderingContext2D.textAlign = 'center'
	canvasRenderingContext2D.lineWidth = 1
	canvasRenderingContext2D.fillStyle = fillStyle
	canvasRenderingContext2D.fillText(specialName, coordinateOriginX, coordinateOriginY + 90)

	// 绘制法定名称
	fixStartPointCircularText(canvasRenderingContext2D, {
		circularText: legalName,
		fontSize: '30px',
		fontFamily: zhCnFontFamily,
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

	let tempFilePath = offscreenCanvas.toDataURL()
	if (+emulateLevel)
		tempFilePath = await mergeImage(join(dirname(), `./texture/texture-level-${emulateLevel}.jpg`), tempFilePath)

	return tempFilePath
}
