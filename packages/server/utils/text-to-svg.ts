/**
 * @see https://github.com/shrhdk/text-to-svg
 */

import { join } from 'node:path'
import type { Font } from 'opentype.js'
import * as opentype from 'opentype.js'
import { esDirname } from './es-dirname'

const DEFAULT_FONT = join(esDirname(), '../fonts/Arial.woff')

type IAnchor = 'baseline' | 'top' | 'bottom' | 'middle' | 'left' | 'center' | 'right'
interface UserConfig {
	fontSize?: number
	tracking?: number
	letterSpacing?: number
	kerning?: boolean
	anchor?: IAnchor
	x?: number
	y?: number
	attributes?: { [key: string]: any }
}

function parseAnchorOption(anchor: IAnchor) {
	const matchHorizontal = anchor.match(/left|center|right/gi)
	const horizontal = !Array.isArray(matchHorizontal) ? 'left' : matchHorizontal[0]

	const matchVertical = anchor.match(/baseline|top|bottom|middle/gi)
	const vertical = !Array.isArray(matchVertical) ? 'baseline' : matchVertical[0]

	return { horizontal, vertical }
}

export class TextToSVG {
	font: Font
	constructor(font: Font) {
		this.font = font
	}

	static loadSync(file = DEFAULT_FONT) {
		return new TextToSVG(opentype.loadSync(file))
	}

	static load(url: string, cb: any) {
		opentype.load(url, (err, font) => {
			if (err !== null)
				return cb(err, null)

			return cb(null, new TextToSVG(font!))
		})
	}

	getWidth(text: string, options: UserConfig) {
		const fontSize = options.fontSize ?? 72
		const kerning = options.kerning ?? true
		const fontScale = 1 / this.font.unitsPerEm * fontSize

		let width = 0
		const glyphs = this.font.stringToGlyphs(text)
		for (let i = 0; i < glyphs.length; i++) {
			const glyph = glyphs[i]

			if (glyph.advanceWidth)
				width += glyph.advanceWidth * fontScale

			if (kerning && i < glyphs.length - 1) {
				const kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1])
				width += kerningValue * fontScale
			}

			if (options.letterSpacing)
				width += options.letterSpacing * fontSize

			else if (options.tracking)
				width += (options.tracking / 1000) * fontSize
		}
		return width
	}

	getHeight(fontSize: number) {
		const fontScale = 1 / this.font.unitsPerEm * fontSize
		return (this.font.ascender - this.font.descender) * fontScale
	}

	getMetrics(text: string, options: UserConfig = {}) {
		const fontSize = options.fontSize ?? 72
		const anchor = parseAnchorOption(options.anchor ?? 'left')

		const width = this.getWidth(text, options)
		const height = this.getHeight(fontSize)

		const fontScale = 1 / this.font.unitsPerEm * fontSize
		const ascender = this.font.ascender * fontScale
		const descender = this.font.descender * fontScale

		let x = options.x || 0
		switch (anchor.horizontal) {
			case 'left':
				x -= 0
				break
			case 'center':
				x -= width / 2
				break
			case 'right':
				x -= width
				break
			default:
				throw new Error(`Unknown anchor option: ${anchor.horizontal}`)
		}

		let y = options.y || 0
		switch (anchor.vertical) {
			case 'baseline':
				y -= ascender
				break
			case 'top':
				y -= 0
				break
			case 'middle':
				y -= height / 2
				break
			case 'bottom':
				y -= height
				break
			default:
				throw new Error(`Unknown anchor option: ${anchor.vertical}`)
		}

		const baseline = y + ascender

		return {
			x,
			y,
			baseline,
			width,
			height,
			ascender,
			descender,
		}
	}

	getPathData(text: string, options: UserConfig = {}) {
		const fontSize = options.fontSize || 72
		const kerning = options.kerning ?? true
		const letterSpacing = options.letterSpacing ?? undefined
		const tracking = options.tracking ?? undefined
		const metrics = this.getMetrics(text, options)
		const path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, { kerning, letterSpacing, tracking })

		return path.toPathData(2)
	}

	getPath(text: string, options: UserConfig = {}) {
		const attributes = Object.keys(options.attributes || {})
			.map(key => `${key}="${options.attributes![key]}"`)
			.join(' ')
		const d = this.getPathData(text, options)

		if (attributes)
			return `<path ${attributes} d="${d}"/>`

		return `<path d="${d}"/>`
	}

	getSVG(text: string, options = {}) {
		const metrics = this.getMetrics(text, options)
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${metrics.width}" height="${metrics.height}">`
		svg += this.getPath(text, options)
		svg += '</svg>'

		return svg
	}

	getDebugSVG(text: string, options: UserConfig = {}) {
		options = JSON.parse(JSON.stringify(options))

		options.x = options.x || 0
		options.y = options.y || 0
		const metrics = this.getMetrics(text, options)
		const box = {
			width: Math.max(metrics.x + metrics.width, 0) - Math.min(metrics.x, 0),
			height: Math.max(metrics.y + metrics.height, 0) - Math.min(metrics.y, 0),
		}
		const origin = {
			x: box.width - Math.max(metrics.x + metrics.width, 0),
			y: box.height - Math.max(metrics.y + metrics.height, 0),
		}

		// Shift text based on origin
		options.x += origin.x
		options.y += origin.y

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${box.width}" height="${box.height}">`
		svg += `<path fill="none" stroke="red" stroke-width="1" d="M0,${origin.y}L${box.width},${origin.y}"/>` // X Axis
		svg += `<path fill="none" stroke="red" stroke-width="1" d="M${origin.x},0L${origin.x},${box.height}"/>` // Y Axis
		svg += this.getPath(text, options)
		svg += '</svg>'

		return svg
	}
}

export 	const getPathDataArr = (text: string, fontFamily = 'Arial', fontSize) => {
	const textToSVG = TextToSVG.loadSync(join(esDirname(), `../fonts/${fontFamily}.woff`))
	return text.split('').reduce((acc, t) => {
		return [...acc, textToSVG.getPathData(t, { fontSize, anchor: 'center' })]
	}, [])
}

export 	const getPathDataStr = (text: string, fontFamily = 'Arial', fontSize) => {
	const textToSVG = TextToSVG.loadSync(join(esDirname(), `../fonts/${fontFamily}.woff`))
	return textToSVG.getPathData(text, { fontSize, anchor: 'center' })
}
