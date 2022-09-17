import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSpinStore = defineStore('spin', () => {
	const isShowSpin = ref(false)

	function toggleSpin() {
		isShowSpin.value = !isShowSpin
	}

	function openSpin() {
		isShowSpin.value = true
	}
	function closeSpin() {
		isShowSpin.value = false
	}
	return {
		isShowSpin,
		openSpin,
		closeSpin,
		toggleSpin,
	}
})

if (import.meta.hot)
	import.meta.hot.accept(acceptHMRUpdate(useSpinStore, import.meta.hot))
