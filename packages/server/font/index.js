import { writeFileSync } from 'node:fs'
import { createCanvas, registerFont } from 'canvas'
registerFont('./HanyiSentyJournal.ttf', { family: '汉仪新蒂珍珠奶茶' })

const canvas = createCanvas(500, 500)
const ctx = canvas.getContext('2d')

ctx.textAlign = 'center'
ctx.font = '100px "汉仪新蒂珍珠奶茶"'
// ctx.font = '30px "Wawati SC"'
ctx.fillText('我Everyone', 250, 250)

const buffer = canvas.toBuffer('image/png')
writeFileSync('./image.png', buffer)
