import { action, observable } from 'mobx-miniprogram'
import { fontList } from '../utils/index'

export const store = observable({
	fontList: fontList.map(({ zh }) => zh),
	updateFontList: action(function (fontName: string) {
		this.fontList = [fontName, ...this.fontList]
	}),
})

export const storeBehavior = {
	store,
	fields: ['fontList'],
	action: ['update'],
}
