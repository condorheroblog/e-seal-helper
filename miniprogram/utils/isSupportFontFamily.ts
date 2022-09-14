/**
 * @see https://www.zhangxinxu.com/wordpress/2018/02/js-detect-suppot-font-family/
 */
export const isSupportFontFamily = function (f: string) {
	if (typeof f !== 'string')
		return false

	const h = 'Arial'
	if (f.toUpperCase() === h.toUpperCase())
		return true

	const e = 'a'
	const d = 100
	const a = 100
	const i = 100
	const c = wx.createOffscreenCanvas({ type: '2d' })
	const b = c.getContext('2d')
	c.width = a
	c.height = i
	b.textAlign = 'center'
	b.fillStyle = 'black'
	b.textBaseline = 'middle'
	const g = function (j: string) {
		b.clearRect(0, 0, a, i)
		b.font = `${d}px ${j}, ${h}`
		b.fillText(e, a / 2, i / 2)
		const k = b.getImageData(0, 0, a, i).data
		return [...k]
	}
	const baseImageData = g(h)
	const testImageData = g(f)
	let isSupport = false
	for (let index = 0; index < baseImageData.length; index++) {
		if (baseImageData[index] === testImageData[index])
			continue
		isSupport = true
		break
	}
	return isSupport
}
