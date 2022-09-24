export const getImageElement = (src: string) => {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image()
		image.src = src
		image.onload = () => {
			resolve(image)
		}
		image.onerror = (error) => {
			reject(error)
		}
	})
}
