import { loadImage } from 'canvas'

// serverless function 默认十秒不返回结果失败，canvas 的 Image load 事件太慢了。

export const getImageElement = async (src: string) => {
	return await loadImage(src)
}
