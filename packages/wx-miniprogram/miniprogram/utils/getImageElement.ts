export const getImageElement = (canvasContext: WechatMiniprogram.OffscreenCanvas, src: string) => {
	return new Promise<WechatMiniprogram.Image>((resolve, reject) => {
		const image = canvasContext.createImage()
		image.src = src
		image.onload = () => {
			resolve(image)
		}
		image.onerror = (error) => {
			reject(error)
		}
	})
}
