import type { Handler, HandlerEvent } from '@netlify/functions'
import { createSeal } from '../seal'

export const handler: Handler = async (event: HandlerEvent) => {
	const { httpMethod, body = '{}' } = event
	if (httpMethod === 'POST') {
		const {
			legalName,
			specialName,
			zhCnFontFamily,
			infoEncode,
			emulateLevel,
			enFontFamily,
		} = JSON.parse(body!)
		const tempFilePath = await createSeal({
			legalName,
			specialName,
			zhCnFontFamily,
			infoEncode,
			emulateLevel,
			enFontFamily,
		})

		return {
			statusCode: 200,
			body: JSON.stringify({ tempFilePath }),
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		}
	}
	return {
		statusCode: 400,
	}
}
