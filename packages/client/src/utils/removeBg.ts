import { getImageElement } from './getImageElement'

export const removeBg = async (imagePath: string) => {
	const img = await getImageElement(imagePath)
	const canvas = document.createElement('canvas')
	const { width, height } = img
	canvas.width = width
	canvas.height = height
	const context = canvas.getContext('2d')!
	context.drawImage(img, 0, 0)
	const imageData = context.getImageData(0, 0, width, height)
	const pixels = imageData.data
	let index = 0
	while (index <= pixels.length) {
		if (pixels[index] === 255 && pixels[index + 1] === 255 && pixels[index + 2] === 255)
			pixels[index + 3] = 0

		index += 4
	}
	context.putImageData(imageData, 0, 0)
	return canvas.toDataURL()
}
