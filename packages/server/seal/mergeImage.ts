import { createCanvas } from 'canvas'
import { getImageElement } from './getImageElement'

export const mergeImage = (baseImgPath: string, sealImg: string) => {
	return new Promise<string>((resolve, reject) => {
		(async () => {
			try {
				const offscreenCanvas = createCanvas(500, 500)
				const canvasRenderingContext2D = offscreenCanvas.getContext('2d')
				canvasRenderingContext2D.globalCompositeOperation = 'lighten'
				// const baseImgInfo = await getImageElement(
				// 	baseImgPath,
				// )
				// const sealImgInfo = await getImageElement(
				// 	sealImg,
				// )
				const [baseImgInfo, sealImgInfo] = await Promise.all([getImageElement(baseImgPath), getImageElement(sealImg)])
				canvasRenderingContext2D.drawImage(baseImgInfo, 0, 0)
				canvasRenderingContext2D.drawImage(sealImgInfo, 0, 0)
				const tempFilePath = offscreenCanvas.toDataURL()
				resolve(tempFilePath)
			}
			catch (error) {
				reject(error)
			}
		})()
	})
}
