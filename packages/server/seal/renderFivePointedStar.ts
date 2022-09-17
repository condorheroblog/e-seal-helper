/**
 * 五笔绘制五角星
 * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为 radius, rotate = 0 时一个顶点在对称轴上
 * rotate: 绕对称轴旋转 rotate 弧度
 */
export function renderFivePointedStar(context: any, sx: number, sy: number, radius: number, color: string, rotate: number) {
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
}
