interface OptionsFixStartPoint {
	circularText: string
	fontSize: string
	fontFamily: string
	distance: number
	coordinateOriginX: number
	coordinateOriginY: number
	startAngle: number
	endAngle: number
}

interface OptionsFixMidpoint {
	circularText: string
	fontSize: string
	fontFamily: string
	distance: number
	coordinateOriginX: number
	coordinateOriginY: number
	midAngle: number
	charTiltAngle: number
}

export const fixStartPointCircularText = (ctx: any, {
	circularText,
	fontSize,
	fontFamily,
	coordinateOriginX,
	coordinateOriginY,
	distance,
	startAngle,
	endAngle,
}: OptionsFixStartPoint) => {
	ctx.save()
	ctx.translate(coordinateOriginX, coordinateOriginY)
	if (fontFamily)
		ctx.font = `${fontSize} ${fontFamily}`
	else
		ctx.font = fontSize
	const textLength = circularText.length
	const angle = endAngle / (textLength - 1)
	// const angle = 4 * Math.PI / (3 * (textLength - 1))
	for (let i = 0; i < textLength; i++) {
		const c = circularText[i]
		if (i === 0)
			ctx.rotate(startAngle)
		else
			ctx.rotate(endAngle - startAngle ? angle : -angle)
		ctx.save()
		ctx.translate(distance, 0)
		// 转正文字
		ctx.rotate(Math.PI / 2)
		ctx.fillText(c, 0, 5)
		ctx.restore()
	}
	ctx.restore()
}

const degreeToRadians = (degree: number) => degree * Math.PI / 180

export const fixMidpointCircularText = (ctx: any, {
	circularText,
	fontSize,
	fontFamily,
	coordinateOriginX,
	coordinateOriginY,
	charTiltAngle,
	distance,
	midAngle,
}: OptionsFixMidpoint) => {
	ctx.save()
	ctx.translate(coordinateOriginX, coordinateOriginY)
	if (fontFamily)
		ctx.font = `${fontSize} ${fontFamily}`
	else
		ctx.font = fontSize
	const textLength = circularText.length
	let charAngle = degreeToRadians(charTiltAngle)
	if (textLength > 13)
		// 比 90 度多一点点
		charAngle = 13 / 24 * Math.PI / textLength

	const midIndex = Math.floor((textLength - 1) / 2)
	const halfCharAngle = charAngle / 2

	for (let i = 0; i < textLength; i++) {
		const c = circularText[i]
		ctx.save()
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
		ctx.rotate(rotateExpress)
		ctx.translate(distance, 0)
		// 转正文字
		ctx.rotate(3 / 2 * Math.PI)
		ctx.fillText(c, 0, -1)
		ctx.restore()
	}

	ctx.restore()
}
