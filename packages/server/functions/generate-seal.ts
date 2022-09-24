import type { Handler, HandlerEvent } from '@netlify/functions'
import { getPathDataArr, getPathDataStr } from '../utils'

export const handler: Handler = async (event: HandlerEvent) => {
	const { httpMethod, body = '{}' } = event
	if (httpMethod === 'POST') {
		const {
			legalName,
			specialName,
			cnFontFamily,
			infoEncode,
			enFontFamily,
			legalNameFontSize,
			specialNameFontSize,
			infoEncodeFontSize,
		} = JSON.parse(body!)

		const legalNamePaths = getPathDataArr(legalName, cnFontFamily, legalNameFontSize)
		const specialNamePaths = getPathDataStr(specialName, cnFontFamily, specialNameFontSize)
		const codePaths = getPathDataArr(infoEncode, enFontFamily, infoEncodeFontSize)

		return {
			statusCode: 200,
			body: JSON.stringify({ legalNamePaths, specialNamePaths, codePaths }),
		}
	}
	return {
		statusCode: 400,
	}
}
