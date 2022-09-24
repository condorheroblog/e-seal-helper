// import { fileURLToPath } from 'node:url'
// import { dirname } from 'node:path';
// import { join } from 'node:path'

// fix: import.meta.url is undefined
// https://github.com/netlify/cli/issues/4601
// export const __dirname = dirname(fileURLToPath(import.meta.url))

// export const getAbsolutePath = (filePath: string) => join(__dirname, filePath)

/**
 * @see https://github.com/vdegenne/es-dirname/blob/master/es-dirname.js
*/
import { dirname } from 'node:path'
import { platform } from 'node:os'

export const esDirname = () => {
	try {
		throw new Error('ShadowsAlwaysDieTwice')
	}
	catch (e) {
		const initiator = e.stack.split('\n').slice(2, 3)[0]
		let filePath = /(?<path>[^\(\s]+):[0-9]+:[0-9]+/.exec(initiator)!.groups!.path
		if (filePath.includes('file'))
			filePath = new URL(filePath).pathname

		let _dirname = dirname(filePath)
		if (_dirname[0] === '/' && platform() === 'win32')
			_dirname = _dirname.slice(1)

		return _dirname
	}
}
