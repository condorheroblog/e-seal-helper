import { getImageElement } from './getImageElement'

export const mergeImage = (baseImgPath: string, sealImg: string) => {
	return new Promise<string>((resolve, reject) => {
		(async () => {
			try {
				const offscreenCanvas = wx.createOffscreenCanvas({ type: '2d', width: 500, height: 500 })
				const canvasRenderingContext2D = offscreenCanvas.getContext('2d')
				canvasRenderingContext2D.globalCompositeOperation = 'lighten'
				const baseImgInfo = await getImageElement(
					offscreenCanvas,
					baseImgPath,
				)
				const sealImgInfo = await getImageElement(
					offscreenCanvas,
					sealImg,
				)
				canvasRenderingContext2D.drawImage(baseImgInfo, 0, 0)
				canvasRenderingContext2D.drawImage(sealImgInfo, 0, 0)
				const { tempFilePath } = await wx.canvasToTempFilePath({
					canvas: offscreenCanvas,
				})
				resolve(tempFilePath)
			}
			catch (error) {
				reject(error)
			}
		})()
	})
}
