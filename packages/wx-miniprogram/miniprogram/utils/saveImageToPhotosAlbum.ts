export const saveImageToPhotosAlbum = (filePath: string) => {
	return new Promise<{ confirm: boolean }>(() => {
		(async () => {
			const { authSetting } = await wx.getSetting()
			if (authSetting['scope.writePhotosAlbum']) {
				try {
					await wx.saveImageToPhotosAlbum({
						filePath,
					})
					wx.showToast({
						title: '图片已保存到相册中',
						icon: 'success',
						duration: 2000,
					})
				}
				catch (error) {
					// 取消保存
					wx.showToast({
						title: '取消保存',
						icon: 'none',
					})
				}
			}
			else {
				try {
					await wx.authorize({
						scope: 'scope.writePhotosAlbum',
					})
					wx.showToast({
						icon: 'none',
						title: '获取权限成功,请再次点击保存按钮',
						duration: 2000,
					})
				}
				catch (error) {
					wx.showModal({
						title: '提示',
						content: '需要您授权保存相册权限。1.点击右上菜单-设置 2.删除小程序后重新授权',
						showCancel: false,
					})
					// if (error.errMsg === 'authorize:fail auth deny') {
					// 	try {
					// 		const { confirm, cancel } = await wx.showModal({
					// 			title: '是否打开设置页面',
					// 			content: '需要获取您的相册权限，以保存图片',
					// 		})
					// 		cancel && wx.showToast({
					// 			icon: 'none',
					// 			title: '取消授权',
					// 			duration: 2000,
					// 		})
					// 		/**
					// 		 * wx.openSetting()
					// 		 * @see https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008
					// 		*/
					// 		resolve({ confirm })
					// 	}
					// 	catch (error) {

					// 	}
					// }
				}
			}
		})()
	})
}
